from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.cover_letter_generator import generate_cover_letter as generate_cover_letter_service
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeOut, ResumeList
from app.services.resume_generator import generate_resume as generate_resume_service
from app.services.resume_parser import (
    extract_text_from_pdf,
    extract_text_from_docx,
    parse_resume_with_llm
)

router = APIRouter()


@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed"
        )

    # Read file bytes
    file_bytes = await file.read()

    # Extract text based on file type
    if file.filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_bytes)
    else:
        raw_text = extract_text_from_docx(file_bytes)

    # Parse the extracted text
    parsed_data = parse_resume_with_llm(raw_text)

    # Save to database
    resume = Resume(
        user_id=current_user.id,
        title=file.filename,
        raw_text=raw_text,
        parsed_data=parsed_data,
    )

    db.add(resume)
    await db.flush()
    await db.refresh(resume)

    return resume


@router.get("/", response_model=list[ResumeList])
async def get_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id)
    )
    resumes = result.scalars().all()
    return resumes


@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(
    resume_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return resume

class GenerateResumeRequest(BaseModel):
    resume_id: int
    company: str
    role: str
    job_description: str
    region: str = "usa"

from pydantic import BaseModel

class CoverLetterRequest(BaseModel):
    resume_id: int
    company: str
    role: str
    job_description: str
    tone: str = "professional"
    region: str = "usa"

@router.post("/generate")
async def generate_resume(
    request: GenerateResumeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get user's uploaded resume
    result = await db.execute(
        select(Resume).where(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.parsed_data:
        raise HTTPException(status_code=400, detail="Resume has no parsed data")

    # Generate tailored resume
    generated = generate_resume_service(
        user_parsed_resume=resume.parsed_data,
        company=request.company,
        role=request.role,
        job_description=request.job_description,
        region=request.region
    )

    if "error" in generated:
        raise HTTPException(status_code=500, detail=generated["error"])

    # Save generated resume to DB
    new_resume = Resume(
        user_id=current_user.id,
        title=f"{request.company} {request.role} Resume",
        raw_text=str(generated),
        parsed_data=generated,
        ats_score=generated.get("ats_score"),
    )

    db.add(new_resume)
    await db.flush()
    await db.refresh(new_resume)

    return {
        "id": new_resume.id,
        "title": new_resume.title,
        "ats_score": new_resume.ats_score,
        "resume": generated
    }




@router.post("/cover-letter")
async def create_cover_letter(
    request: CoverLetterRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get user's resume
    result = await db.execute(
        select(Resume).where(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Generate cover letter
    cover_letter = generate_cover_letter_service(
        user_resume=resume.parsed_data,
        company=request.company,
        role=request.role,
        job_description=request.job_description,
        tone=request.tone,
        region=request.region
    )

    return cover_letter