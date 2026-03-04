import requests
from bs4 import BeautifulSoup
import time
import re


SUBREDDITS = [
    "resumereveal",
    "cscareerquestions",
    "jobs",
    "recruitinghell"
]

REGION_KEYWORDS = {
    "usa": ["usa", "us", "united states", "america", "new york", "san francisco", "seattle"],
    "india": ["india", "bangalore", "hyderabad", "mumbai", "delhi", "chennai"],
    "uk": ["uk", "united kingdom", "london", "manchester"],
    "canada": ["canada", "toronto", "vancouver", "montreal"],
    "germany": ["germany", "berlin", "munich"],
    "australia": ["australia", "sydney", "melbourne"]
}


def detect_region(text: str, target_region: str) -> bool:
    """Check if a post mentions the target region."""
    text_lower = text.lower()
    keywords = REGION_KEYWORDS.get(target_region.lower(), [])
    
    # If no keywords defined for region, accept all
    if not keywords:
        return True
    
    return any(kw in text_lower for kw in keywords)


def scrape_subreddit(
    subreddit: str,
    company: str,
    role: str,
    region: str,
    max_results: int = 10
) -> list[dict]:
    """Scrape a subreddit for company+role+region resumes."""

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    # Search within subreddit
    search_url = f"https://www.reddit.com/r/{subreddit}/search.json"
    params = {
        "q": f"{company} {role} resume",
        "restrict_sr": "on",
        "sort": "relevance",
        "limit": max_results
    }

    try:
        response = requests.get(
            search_url,
            params=params,
            headers=headers,
            timeout=10
        )

        if response.status_code != 200:
            print(f"Reddit returned {response.status_code} for r/{subreddit}")
            return []

        data = response.json()
        posts = data.get("data", {}).get("children", [])

        resumes = []
        for post in posts:
            post_data = post.get("data", {})
            title = post_data.get("title", "")
            body = post_data.get("selftext", "")
            url = post_data.get("url", "")

            # Combine title + body
            full_text = f"{title}\n\n{body}"

            # Skip if too short
            if len(full_text.strip()) < 200:
                continue

            # Check region match
            if not detect_region(full_text, region):
                continue

            # Detect hiring outcome from title
            outcome = "unknown"
            title_lower = title.lower()
            if any(w in title_lower for w in ["hired", "got offer", "accepted", "got the job"]):
                outcome = "hired"
            elif any(w in title_lower for w in ["rejected", "failed", "no offer"]):
                outcome = "rejected"

            resumes.append({
                "text": full_text,
                "source_url": f"https://reddit.com{post_data.get('permalink', '')}",
                "company": company,
                "role": role,
                "region": region,
                "outcome": outcome,
                "source": "reddit"
            })

            time.sleep(0.5)

        return resumes

    except Exception as e:
        print(f"Reddit scrape error for r/{subreddit}: {e}")
        return []


def scrape_reddit_resumes(
    company: str,
    role: str,
    region: str = "usa",
    max_per_subreddit: int = 5
) -> list[dict]:
    """Scrape multiple subreddits for resumes."""

    all_resumes = []

    for subreddit in SUBREDDITS:
        print(f"Scraping r/{subreddit} for {company} {role} {region}...")
        resumes = scrape_subreddit(
            subreddit, company, role, region, max_per_subreddit
        )
        all_resumes.extend(resumes)
        print(f"Found {len(resumes)} posts in r/{subreddit}")
        time.sleep(1)

    return all_resumes