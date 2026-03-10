import json
import re
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def clean_json_response(response: str) -> str:
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    return response.strip()


def calculate_ats_score(
    resume: dict,
    job_description: str,
    company: str = "",
    role: str = ""
) -> dict:
    """
    Industry-grade ATS scorer with 8 dimensions.
    """

    prompt = f"""You are an industry-grade ATS (Applicant Tracking System) analyzer used by top companies like Google, Amazon, and Microsoft.

Analyze this resume against the job description with extreme precision.

Company: {company}
Role: {role}

Job Description:
{job_description}

Resume:
{json.dumps(resume, indent=2)}

Score each dimension from 0-100 based on these STRICT criteria:

1. KEYWORD MATCH (weight: 25%)
   - Count exact keyword matches from JD in resume
   - Count semantic/related keyword matches
   - Penalize heavily for missing critical keywords

2. SKILLS MATCH (weight: 20%)
   - Required skills present in resume?
   - Nice-to-have skills present?
   - Skills relevance to role

3. EXPERIENCE RELEVANCE (weight: 20%)
   - Job titles match target role?
   - Years of experience sufficient?
   - Industry/domain relevance
   - Responsibilities alignment

4. EDUCATION MATCH (weight: 10%)
   - Degree level matches requirement?
   - Field of study relevant?
   - Institution quality

5. FORMAT COMPLIANCE (weight: 10%)
   - Standard section names (Experience, Education, Skills)
   - Proper date formats
   - Contact info complete
   - No ATS-breaking elements

6. QUANTIFIED ACHIEVEMENTS (weight: 8%)
   - Count metrics/numbers/percentages
   - Impact statements present
   - Scale of achievements

7. ACTION VERBS (weight: 4%)
   - Strong action verbs at start of bullets
   - No passive language
   - Variety of verbs

8. COMPLETENESS (weight: 3%)
   - All required sections present
   - No empty sections
   - Appropriate length

Calculate weighted overall score.

Grading:
A+ = 95-100 (Exceptional - guaranteed interview)
A  = 85-94  (Strong - very likely interview)  
B+ = 75-84  (Good - likely interview)
B  = 65-74  (Average - possible interview)
C  = 50-64  (Weak - unlikely interview)
D  = 0-49   (Poor - will not pass ATS)

Return ONLY a JSON object:
{{
    "overall_score": 92,
    "grade": "A",
    "verdict": "Strong candidate - very likely to pass ATS",
    "breakdown": {{
        "keyword_match": {{"score": 95, "weight": 25, "weighted_score": 23.75}},
        "skills_match": {{"score": 90, "weight": 20, "weighted_score": 18.0}},
        "experience_relevance": {{"score": 88, "weight": 20, "weighted_score": 17.6}},
        "education_match": {{"score": 85, "weight": 10, "weighted_score": 8.5}},
        "format_compliance": {{"score": 95, "weight": 10, "weighted_score": 9.5}},
        "quantified_achievements": {{"score": 90, "weight": 8, "weighted_score": 7.2}},
        "action_verbs": {{"score": 88, "weight": 4, "weighted_score": 3.52}},
        "completeness": {{"score": 95, "weight": 3, "weighted_score": 2.85}}
    }},
    "missing_keywords": ["keyword1", "keyword2"],
    "missing_skills": ["skill1", "skill2"],
    "matched_keywords": ["keyword1", "keyword2"],
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": [
        {{"priority": "high", "issue": "issue description", "fix": "how to fix"}},
        {{"priority": "medium", "issue": "issue description", "fix": "how to fix"}}
    ],
    "industry_keywords_found": ["kw1", "kw2"],
    "action_verbs_found": ["verb1", "verb2"],
    "metrics_found": ["40% improvement", "100+ users"],
    "recruiter_tips": ["tip1", "tip2"]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
    )

    raw = response.choices[0].message.content
    cleaned = clean_json_response(raw)

    try:
        result = json.loads(cleaned)
        return result
    except json.JSONDecodeError:
        return {
            "overall_score": 0,
            "grade": "F",
            "verdict": "Failed to analyze resume",
            "error": "JSON parse error",
            "raw": raw
        }