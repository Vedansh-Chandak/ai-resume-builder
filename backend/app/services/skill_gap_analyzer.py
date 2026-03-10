import json
import re
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def clean_json_response(response: str) -> str:
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*', '', response)
    return response.strip()


def analyze_skill_gap(
    resume: dict,
    company: str,
    role: str,
    job_description: str
) -> dict:
    """
    Analyze skill gap between user's current profile and target role.
    Returns detailed learning path and timeline.
    """

    prompt = f"""You are an expert career coach and technical recruiter at {company}.
Analyze the skill gap between this candidate's profile and the target role.

Target Company: {company}
Target Role: {role}

Job Description:
{job_description}

Candidate's Current Profile:
{json.dumps(resume, indent=2)}

Provide a DETAILED skill gap analysis with actionable learning path.

Return ONLY a JSON object:
{{
    "overall_match_percentage": 72,
    "ready_to_apply": false,
    "readiness_level": "Developing",
    "summary": "Brief 2-3 sentence summary of candidate's fit",
    
    "skills_analysis": {{
        "matched_skills": ["skill1", "skill2"],
        "missing_critical": [
            {{
                "skill": "System Design",
                "importance": "critical",
                "reason": "Why this skill is needed for the role"
            }}
        ],
        "missing_nice_to_have": [
            {{
                "skill": "GraphQL",
                "importance": "nice-to-have",
                "reason": "Would strengthen application"
            }}
        ],
        "transferable_skills": [
            {{
                "current_skill": "REST APIs",
                "transfers_to": "GraphQL",
                "reason": "Strong API fundamentals make GraphQL easier to learn"
            }}
        ]
    }},
    
    "experience_analysis": {{
        "required_years": "3+",
        "current_years": "1",
        "gap": "2 years",
        "quality_assessment": "Strong project quality compensates partially for limited years",
        "missing_experience": ["Large scale systems", "Team leadership"]
    }},
    
    "education_analysis": {{
        "meets_requirement": true,
        "assessment": "BTech CS meets minimum requirements"
    }},
    
    "learning_path": [
        {{
            "skill": "System Design",
            "priority": 1,
            "importance": "critical",
            "time_to_learn": "2-3 months",
            "resources": [
                {{"name": "Grokking System Design", "type": "course", "url": "https://www.educative.io/courses/grokking-the-system-design-interview"}},
                {{"name": "System Design Primer", "type": "github", "url": "https://github.com/donnemartin/system-design-primer"}}
            ],
            "milestones": ["Learn CAP theorem", "Design URL shortener", "Design Twitter feed"]
        }}
    ],
    
    "timeline": {{
        "optimistic": "4 months",
        "realistic": "6 months",
        "conservative": "9 months",
        "breakdown": [
            {{"month": "Month 1-2", "focus": "System Design fundamentals"}},
            {{"month": "Month 3-4", "focus": "Microservices + distributed systems"}},
            {{"month": "Month 5-6", "focus": "Projects + interview prep"}}
        ]
    }},
    
    "immediate_actions": [
        "Action to take this week",
        "Action to take this month"
    ],
    
    "strengths_to_highlight": [
        "Strength that makes candidate stand out"
    ],
    
    "company_specific_tips": [
        "Specific tip for {company} interviews"
    ]
}}

Readiness levels:
- "Ready" = 85%+ match, apply now
- "Almost Ready" = 70-84%, apply in 1-2 months
- "Developing" = 50-69%, apply in 3-6 months  
- "Early Stage" = below 50%, apply in 6+ months"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    raw = response.choices[0].message.content
    cleaned = clean_json_response(raw)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {
            "error": "Failed to analyze skill gap",
            "raw": raw
        }