import re


def has_metrics(text: str) -> bool:
    """Check if resume has specific numbers/percentages."""
    pattern = r'\d+%|\d+x|\$\d+|\d+M|\d+K|\d+ users|\d+ engineers|\d+ teams'
    matches = re.findall(pattern, text, re.IGNORECASE)
    return len(matches) >= 2


def has_real_structure(text: str) -> bool:
    """Check if text looks like a real resume."""
    resume_keywords = [
        "experience", "education", "skills",
        "project", "engineer", "developer",
        "university", "bachelor", "master"
    ]
    text_lower = text.lower()
    found = sum(1 for kw in resume_keywords if kw in text_lower)
    return found >= 3


def has_contact_info(text: str) -> bool:
    """Check if resume has real contact information."""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    has_email = bool(re.search(email_pattern, text))
    has_linkedin = "linkedin" in text.lower()
    has_github = "github" in text.lower()
    return has_email or has_linkedin or has_github


def is_too_short(text: str) -> bool:
    """Reject resumes that are too short to be real."""
    return len(text.strip()) < 150


def is_too_perfect(text: str) -> bool:
    """
    AI generated resumes tend to be too perfectly structured.
    Real resumes have some inconsistencies.
    """
    lines = text.strip().split('\n')
    
    # If every line is similar length, likely AI generated
    line_lengths = [len(line) for line in lines if len(line) > 10]
    if not line_lengths:
        return False
    
    avg_length = sum(line_lengths) / len(line_lengths)
    variance = sum((l - avg_length) ** 2 for l in line_lengths) / len(line_lengths)
    
    # Very low variance = too uniform = likely AI
    return variance < 50


def calculate_authenticity_score(
    text: str,
    source: str = "unknown",
    outcome: str = "unknown"
) -> dict:
    """Calculate authenticity score for a resume."""
    
    score = 0
    reasons = []

    # Source credibility
    source_scores = {
        "blind": 35,
        "reddit": 25,
        "linkedin": 20,
        "github": 25,
        "google_docs": 15,
        "manual": 10,
        "unknown": 0
    }
    source_score = source_scores.get(source.lower(), 0)
    score += source_score
    reasons.append(f"Source ({source}): +{source_score}")

    # Hiring outcome
    if outcome == "hired":
        score += 25
        reasons.append("Hired outcome: +25")
    elif outcome == "unknown":
        score += 5
        reasons.append("Unknown outcome: +5")

    # Has specific metrics
    if has_metrics(text):
        score += 15
        reasons.append("Has metrics: +15")

    # Has real resume structure
    if has_real_structure(text):
        score += 10
        reasons.append("Real structure: +10")

    # Has contact info
    if has_contact_info(text):
        score += 10
        reasons.append("Has contact info: +10")

    # Penalties
    if is_too_short(text):
        score -= 20
        reasons.append("Too short: -20")

    if is_too_perfect(text):
        score -= 15
        reasons.append("Too uniform (possible AI): -15")

    return {
        "score": max(0, score),
        "is_authentic": score >= 40,
        "reasons": reasons
    }