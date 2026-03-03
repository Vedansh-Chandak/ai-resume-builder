from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.rag.ingest import ingest_resume, get_ingested_count
from app.services.rag.retriever import retrieve_similar_resumes
import uuid

router = APIRouter()


class SampleResumeRequest(BaseModel):
    company: str
    role: str
    outcome: str = "unknown"
    source: str = "manual"
    resume_text: str


@router.post("/ingest-resume")
async def ingest_sample_resume(
    data: SampleResumeRequest,
    current_user: User = Depends(get_current_user)
):
    doc_id = str(uuid.uuid4())
    ingest_resume(
        resume_text=data.resume_text,
        company=data.company,
        role=data.role,
        outcome=data.outcome,
        source=data.source,
        doc_id=doc_id
    )
    return {
        "message": "Resume ingested successfully",
        "doc_id": doc_id,
        "company": data.company,
        "role": data.role
    }


@router.get("/count")
async def get_resume_count(
    company: str = None,
    current_user: User = Depends(get_current_user)
):
    count = get_ingested_count(company)
    return {"count": count, "company": company or "all"}


@router.get("/search")
async def search_resumes(
    company: str,
    role: str,
    current_user: User = Depends(get_current_user)
):
    results = retrieve_similar_resumes(company=company, role=role)
    return {
        "company": company,
        "role": role,
        "found": len(results),
        "resumes": results
    }