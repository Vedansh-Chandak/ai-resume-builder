import pdfplumber
import json
import re
from docx import Document
from io import BytesIO
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(BytesIO(file_bytes))
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text.strip()


def clean_json_response(response: str) -> str:
    # Remove markdown code fences if present
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    return response.strip()


def parse_resume_with_llm(raw_text: str) -> dict:
    prompt = f"""
You are a resume parser. Extract information from the resume below and return ONLY a JSON object with no extra text, no markdown, no explanation.

Return exactly this structure:
{{
    "name": "full name or null",
    "email": "email or null",
    "phone": "phone or null",
    "linkedin": "linkedin url or null",
    "github": "github url or null",
    "summary": "professional summary or null",
    "experience": [
        {{
            "title": "job title",
            "company": "company name",
            "dates": "start - end date",
            "bullets": ["achievement 1", "achievement 2"]
        }}
    ],
    "education": [
        {{
            "degree": "degree name",
            "institution": "school name",
            "year": "graduation year",
            "gpa": "gpa or null"
        }}
    ],
    "projects": [
        {{
            "name": "project name",
            "description": "short description",
            "tech": ["tech1", "tech2"]
        }}
    ],
    "skills": ["skill1", "skill2"],
    "certifications": []
}}

Resume text:
{raw_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
    )

    raw_response = response.choices[0].message.content
    cleaned = clean_json_response(raw_response)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback if JSON parsing fails
        return {
            "name": None,
            "email": None,
            "phone": None,
            "linkedin": None,
            "github": None,
            "summary": None,
            "experience": [],
            "education": [],
            "projects": [],
            "skills": [],
            "certifications": [],
            "parse_error": "LLM returned invalid JSON"
        }