import json
import re
from groq import Groq
from app.core.config import settings
from app.services.rag.retriever import retrieve_similar_resumes
from app.services.scraper.unified_scraper import scrape_and_ingest
from app.services.rag.ingest import has_enough_data

client = Groq(api_key=settings.GROQ_API_KEY)


def clean_json_response(response: str) -> str:
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    return response.strip()


def calculate_ats_score(resume: dict, job_description: str) -> dict:
    """Score resume against job description for ATS compatibility."""

    prompt = f"""You are an ATS (Applicant Tracking System) scorer.

Score this resume against the job description below.

Job Description:
{job_description}

Resume:
{json.dumps(resume, indent=2)}

Return ONLY a JSON object:
{{
    "score": 85,
    "keyword_match": 80,
    "format_score": 90,
    "missing_keywords": ["keyword1", "keyword2"],
    "suggestions": ["suggestion1", "suggestion2"]
}}

Score rules:
- score: overall ATS score 0-100
- keyword_match: how many JD keywords are in resume 0-100
- format_score: how well formatted for ATS 0-100
- missing_keywords: important keywords from JD missing in resume
- suggestions: specific improvements to make
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
    )

    raw = response.choices[0].message.content
    cleaned = clean_json_response(raw)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {
            "score": 0,
            "keyword_match": 0,
            "format_score": 0,
            "missing_keywords": [],
            "suggestions": ["Failed to parse ATS score"]
        }


def generate_resume_content(
    user_background: dict,
    sample_resumes: list[str],
    company: str,
    role: str,
    job_description: str,
    feedback: str = None
) -> dict:
    """Generate resume using RAG samples + user background."""

    samples_text = ""
    for i, resume in enumerate(sample_resumes, 1):
        samples_text += f"\n--- Sample Resume {i} ---\n{resume}\n"

    feedback_section = ""
    if feedback:
        feedback_section = f"""
Previous ATS feedback to address:
{feedback}
"""

    prompt = f"""You are an expert resume writer specializing in {company} applications.

Here are {len(sample_resumes)} real resumes from people hired at {company} as {role}:
{samples_text}

Study these carefully:
- Keywords and technical terms they use
- How they quantify achievements (numbers, percentages, scale)
- Tone and writing style
- Skills they highlight

Candidate's background:
{json.dumps(user_background, indent=2)}

Target Job Description:
{job_description}
{feedback_section}

Instructions:
1. Rewrite the candidate's resume matching {company}'s style
2. Use keywords from the job description and sample resumes
3. Quantify ALL achievements with numbers where possible
4. Make every bullet point start with a strong action verb
5. NEVER invent experience — only reformat what exists
6. Make it ATS optimized for {role} at {company}

Return ONLY a JSON object with no extra text:
{{
    "name": "candidate name",
    "email": "email",
    "phone": "phone",
    "linkedin": "linkedin or null",
    "github": "github or null",
    "summary": "3 powerful lines targeting {company} {role}",
    "experience": [
        {{
            "title": "job title",
            "company": "company name",
            "dates": "dates",
            "bullets": [
                "Strong action verb + achievement + metric"
            ]
        }}
    ],
    "education": [
        {{
            "degree": "degree",
            "institution": "school",
            "year": "year",
            "gpa": null
        }}
    ],
    "projects": [
        {{
            "name": "name",
            "description": "description",
            "tech": ["tech1", "tech2"]
        }}
    ],
    "skills": ["skill1", "skill2"],
    "certifications": []
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = response.choices[0].message.content
    cleaned = clean_json_response(raw)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to generate resume", "raw": raw}


def generate_resume(
    user_parsed_resume: dict,
    company: str,
    role: str,
    job_description: str,
    region: str = "usa",
    max_attempts: int = 3
) -> dict:
    """
    Full pipeline:
    1. Check/trigger scraper
    2. Retrieve RAG samples
    3. Generate resume
    4. Check ATS score
    5. Regenerate if score < 80
    """

    # Step 1: Ensure we have enough data
    if not has_enough_data(company, role, region, threshold=15):
        print(f"Not enough data for {company} {role} {region} — scraping...")
        scrape_and_ingest(company=company, role=role, region=region)

    # Step 2: Retrieve similar resumes
    sample_resumes = retrieve_similar_resumes(
        company=company,
        role=role,
        region=region,
        n_results=5
    )

    if not sample_resumes:
        return {"error": "No sample resumes found for this company"}

    # Step 3: Generate + ATS loop
    feedback = None
    best_resume = None
    best_score = 0

    for attempt in range(max_attempts):
        print(f"\n🔄 Generation attempt {attempt + 1}/{max_attempts}")

        # Generate resume
        resume = generate_resume_content(
            user_background=user_parsed_resume,
            sample_resumes=sample_resumes,
            company=company,
            role=role,
            job_description=job_description,
            feedback=feedback
        )

        if "error" in resume:
            continue

        # Score it
        ats_result = calculate_ats_score(resume, job_description)
        score = ats_result.get("score", 0)
        print(f"ATS Score: {score}")

        # Track best result
        if score > best_score:
            best_score = score
            best_resume = resume
            best_resume["ats_score"] = score
            best_resume["ats_feedback"] = ats_result

        # If score >= 80 we're done
        if score >= 80:
            print(f"✅ Score {score} >= 80 — accepted!")
            break

        # Otherwise prepare feedback for next attempt
        missing = ats_result.get("missing_keywords", [])
        suggestions = ats_result.get("suggestions", [])
        feedback = f"Missing keywords: {missing}\nSuggestions: {suggestions}"
        print(f"Score {score} < 80 — regenerating with feedback...")

    return best_resume