import requests
from bs4 import BeautifulSoup
import time
import re


def search_google_docs_resumes(company: str, role: str, max_results: int = 10) -> list[str]:
    """Search for public Google Docs resumes for a specific company and role."""
    
    query = f'site:docs.google.com "{company}" "{role}" resume'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}&num={max_results}"
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Extract Google Docs URLs from search results
        urls = []
        for link in soup.find_all("a", href=True):
            href = link["href"]
            if "docs.google.com" in href and "/d/" in href:
                # Clean the URL
                match = re.search(r'https://docs\.google\.com/[^\&]+', href)
                if match:
                    urls.append(match.group(0))
        
        return list(set(urls))[:max_results]
    
    except Exception as e:
        print(f"Search error: {e}")
        return []


def fetch_google_doc_text(doc_url: str) -> str:
    """Fetch text content from a public Google Doc."""
    
    # Convert to export URL
    if "/edit" in doc_url:
        export_url = doc_url.replace("/edit", "/export?format=txt")
    elif "/pub" in doc_url:
        export_url = doc_url.replace("/pub", "/export?format=txt")
    else:
        export_url = doc_url + "/export?format=txt"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    try:
        response = requests.get(export_url, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.text.strip()
        return None
    except Exception as e:
        print(f"Fetch error: {e}")
        return None


def scrape_resumes_for_company(company: str, role: str, max_results: int = 10) -> list[dict]:
    """Full pipeline: search + fetch + return resume texts."""
    
    print(f"Searching for {role} resumes at {company}...")
    urls = search_google_docs_resumes(company, role, max_results)
    print(f"Found {len(urls)} URLs")
    
    resumes = []
    for url in urls:
        print(f"Fetching: {url}")
        text = fetch_google_doc_text(url)
        
        if text and len(text) > 200:  # minimum length check
            resumes.append({
                "text": text,
                "source_url": url,
                "company": company,
                "role": role,
                "source": "google_docs"
            })
        
        time.sleep(1)  # be respectful, don't spam
    
    print(f"Successfully fetched {len(resumes)} resumes")
    
    return resumes