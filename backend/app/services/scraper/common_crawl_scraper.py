import requests
import json
import re
import time


COMMON_CRAWL_INDEX = "https://index.commoncrawl.org/CC-MAIN-2024-10-index"


def search_common_crawl(company: str, role: str, max_results: int = 5) -> list[dict]:
    """Search Common Crawl index for resume pages."""

    # Search for resume pages mentioning the company
    queries = [
        f"{company} {role} resume filetype:pdf",
        f"{company} software engineer resume site:linkedin.com",
        f'"{company}" "{role}" resume'
    ]

    urls_found = []

    for query in queries:
        try:
            params = {
                "url": f"*.com/*resume*",
                "output": "json",
                "limit": max_results,
                "filter": f"=mime:text/html"
            }

            response = requests.get(
                COMMON_CRAWL_INDEX,
                params=params,
                timeout=15
            )

            if response.status_code == 200:
                for line in response.text.strip().split('\n'):
                    if line:
                        try:
                            record = json.loads(line)
                            url = record.get("url", "")
                            if any(kw in url.lower() for kw in ["resume", "cv"]):
                                urls_found.append(record)
                        except json.JSONDecodeError:
                            continue

            time.sleep(1)

        except Exception as e:
            print(f"Common Crawl search error: {e}")

    return urls_found[:max_results]


def fetch_common_crawl_content(record: dict) -> str:
    """Fetch actual page content from Common Crawl S3."""

    try:
        filename = record.get("filename")
        offset = int(record.get("offset", 0))
        length = int(record.get("length", 0))

        if not filename:
            return None

        # Fetch specific byte range from S3
        s3_url = f"https://data.commoncrawl.org/{filename}"
        headers = {
            "Range": f"bytes={offset}-{offset + length - 1}"
        }

        response = requests.get(s3_url, headers=headers, timeout=15)

        if response.status_code in [200, 206]:
            # Extract text from HTML
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.content, "html.parser")

            # Remove scripts and styles
            for tag in soup(["script", "style", "nav", "footer"]):
                tag.decompose()

            text = soup.get_text(separator="\n")

            # Clean up whitespace
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            return "\n".join(lines)

        return None

    except Exception as e:
        print(f"Common Crawl fetch error: {e}")
        return None


def scrape_common_crawl(company: str, role: str, max_results: int = 5) -> list[dict]:
    """Full pipeline: search + fetch from Common Crawl."""

    print(f"🌐 Searching Common Crawl for {role} at {company}...")
    records = search_common_crawl(company, role, max_results)
    print(f"Found {len(records)} records")

    resumes = []
    for record in records:
        content = fetch_common_crawl_content(record)

        if content and len(content) > 300:
            # Check if it looks like a resume
            resume_keywords = ["experience", "education", "skills", "engineer"]
            if sum(1 for kw in resume_keywords if kw in content.lower()) >= 2:
                resumes.append({
                    "text": content[:3000],  # limit size
                    "source_url": record.get("url", ""),
                    "company": company,
                    "role": role,
                    "source": "common_crawl"
                })

        time.sleep(0.5)

    print(f"Successfully fetched {len(resumes)} resumes from Common Crawl")
    return resumes