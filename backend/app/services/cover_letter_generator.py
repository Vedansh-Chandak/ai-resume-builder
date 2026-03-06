import json
import re
import requests
from bs4 import BeautifulSoup
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def clean_response(response: str) -> str:
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    return response.strip()


def research_company(company: str) -> dict:
    """Research company culture, values and recent news."""

    print(f"🔍 Researching {company}...")

    company_data = {
        "culture": [],
        "values": [],
        "recent_news": [],
        "known_for": []
    }

    # Search for company culture
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }

        # Search Google for company culture
        search_url = f"https://www.google.com/search?q={company}+company+culture+values+2024"
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract snippets from search results
        snippets = []
        for div in soup.find_all("div", class_=["BNeawe", "s3v9rd"]):
            text = div.get_text()
            if len(text) > 50:
                snippets.append(text[:200])

        company_data["culture"] = snippets[:3]

    except Exception as e:
        print(f"Company research error: {e}")

    # Add known facts for major companies
    known_companies = {
        "google": {
            "values": ["innovation", "user focus", "data driven", "collaboration"],
            "known_for": ["search", "cloud", "AI", "open source", "20% time"],
            "culture": ["psychological safety", "transparency", "learning culture"]
        },
        "amazon": {
            "values": ["customer obsession", "ownership", "invent and simplify", "bias for action"],
            "known_for": ["leadership principles", "two pizza teams", "working backwards"],
            "culture": ["high performance", "data driven", "frugality"]
        },
        "microsoft": {
            "values": ["growth mindset", "diversity", "inclusion", "empowerment"],
            "known_for": ["cloud", "Azure", "open source", "accessibility"],
            "culture": ["learn it all not know it all", "collaboration"]
        },
        "meta": {
            "values": ["move fast", "be bold", "focus on impact", "be open"],
            "known_for": ["social connection", "VR", "AI research", "scale"],
            "culture": ["hacker culture", "bottom up innovation"]
        }
    }

    company_lower = company.lower()
    if company_lower in known_companies:
        data = known_companies[company_lower]
        company_data["values"] = data["values"]
        company_data["known_for"] = data["known_for"]
        company_data["culture"].extend(data["culture"])

    return company_data


def generate_cover_letter(
    user_resume: dict,
    company: str,
    role: str,
    job_description: str,
    tone: str = "professional",
    region: str = "usa"
) -> dict:
    """Generate a personalized cover letter."""

    # Step 1: Research the company
    company_info = research_company(company)

    # Step 2: Build prompt
    tone_instructions = {
        "professional": "formal, confident, and polished tone",
        "conversational": "warm, friendly, and approachable tone",
        "bold": "assertive, ambitious, and memorable tone"
    }

    tone_desc = tone_instructions.get(tone, tone_instructions["professional"])

    prompt = f"""You are an expert cover letter writer.

Company being applied to: {company}
Role: {role}
Tone: {tone_desc}

Company Research:
- Values: {', '.join(company_info.get('values', []))}
- Known for: {', '.join(company_info.get('known_for', []))}
- Culture: {', '.join(company_info.get('culture', []))}

Candidate Background:
Name: {user_resume.get('name', 'Candidate')}
Summary: {user_resume.get('summary', '')}
Skills: {', '.join(user_resume.get('skills', [])[:15])}
Experience: {json.dumps(user_resume.get('experience', []), indent=2)}
Projects: {json.dumps(user_resume.get('projects', []), indent=2)}

Job Description:
{job_description}

Write a cover letter that:
1. Opens with WHY this specific company (mention their values/culture)
2. Explains WHY this specific role excites them
3. Highlights 2-3 specific achievements from their background
4. Shows what unique value they bring to {company}
5. Closes with confidence and a call to action
6. Sounds human and genuine — NOT generic

The cover letter should be 3-4 paragraphs, around 300-350 words.
Use {tone_desc}.

Return ONLY a JSON object:
{{
    "subject": "Application for {role} position at {company}",
    "cover_letter": "Full cover letter text here...",
    "key_points": ["point1", "point2", "point3"]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
    )

    raw = response.choices[0].message.content
    cleaned = clean_response(raw)

    try:
        result = json.loads(cleaned)
        result["company"] = company
        result["role"] = role
        result["tone"] = tone
        return result
    except json.JSONDecodeError:
        return {
            "subject": f"Application for {role} at {company}",
            "cover_letter": cleaned,
            "key_points": [],
            "company": company,
            "role": role,
            "tone": tone
        }