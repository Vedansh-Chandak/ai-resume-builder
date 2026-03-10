import requests
import time


GITHUB_API = "https://api.github.com"

headers = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "ai-resume-builder"
}


def search_github_profiles(company: str, role: str, max_results: int = 10) -> list[dict]:
    """Search GitHub for developer profiles mentioning a company."""

    query = f"{company} {role} engineer"
    url = f"{GITHUB_API}/search/users?q={query.replace(' ', '+')}&per_page={max_results}"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get("items", [])
        return []
    except Exception as e:
        print(f"GitHub search error: {e}")
        return []


def fetch_github_profile(username: str) -> dict:
    """Fetch a GitHub user's profile and README."""

    profile_url = f"{GITHUB_API}/users/{username}"
    readme_url = f"{GITHUB_API}/repos/{username}/{username}/readme"

    try:
        # Get profile info
        profile_response = requests.get(profile_url, headers=headers, timeout=10)
        profile = profile_response.json() if profile_response.status_code == 200 else {}

        # Get profile README
        readme_response = requests.get(readme_url, headers=headers, timeout=10)
        readme_text = ""

        if readme_response.status_code == 200:
            import base64
            content = readme_response.json().get("content", "")
            if content:
                readme_text = base64.b64decode(content).decode("utf-8")

        # Combine profile info into resume-like text
        resume_text = f"""
Name: {profile.get('name', username)}
Company: {profile.get('company', 'N/A')}
Location: {profile.get('location', 'N/A')}
Bio: {profile.get('bio', 'N/A')}
Public Repos: {profile.get('public_repos', 0)}
GitHub: https://github.com/{username}

Profile README:
{readme_text}
        """.strip()

        return {
            "text": resume_text,
            "username": username,
            "company": profile.get("company", ""),
            "source": "github"
        }

    except Exception as e:
        print(f"GitHub profile error for {username}: {e}")
        return {}


def scrape_github_profiles(company: str, role: str, max_results: int = 10) -> list[dict]:
    """Full pipeline: search profiles + fetch details."""

    print(f"Searching GitHub for {role} at {company}...")
    users = search_github_profiles(company, role, max_results)
    print(f"Found {len(users)} users")

    resumes = []
    for user in users:
        username = user.get("login")
        if not username:
            continue

        profile = fetch_github_profile(username)

        if profile and len(profile.get("text", "")) > 100:
            profile["company"] = company
            profile["role"] = role
            resumes.append(profile)

        time.sleep(0.5)  # GitHub rate limit is generous but be polite

    print(f"Successfully fetched {len(resumes)} profiles")
    return resumes