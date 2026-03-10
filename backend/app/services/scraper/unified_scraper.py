from app.services.scraper.google_docs_scraper import scrape_resumes_for_company
from app.services.scraper.github_scraper import scrape_github_profiles
from app.services.scraper.common_crawl_scraper import scrape_common_crawl
from app.services.scraper.reddit_scraper import scrape_reddit_resumes
from app.services.scraper.authenticity_scorer import calculate_authenticity_score
from app.services.rag.ingest import ingest_resume, has_enough_data
import uuid


def scrape_and_ingest(
    company: str,
    role: str,
    region: str = "usa",
    max_per_source: int = 5
) -> dict:
    # Clean inputs
    company = company.strip()
    role = role.strip()
    region = region.strip().lower()

    results = {
        "company": company,
        "role": role,
        "region": region,
        "scraped": 0,
        "authentic": 0,
        "ingested": 0,
        "rejected": 0,
        "skipped": False,
        "sources": {}
    }

    # Check if we already have enough data
    if has_enough_data(company, role, region, threshold=15):
        print(f"✅ Already have enough data for {company} {role} {region} — skipping scrape")
        results["skipped"] = True
        return results

    all_resumes = []

    # Source 1: Reddit
    print(f"\n Scraping Reddit...")
    try:
        reddit_resumes = scrape_reddit_resumes(
            company, role, region, max_per_source
        )
        all_resumes.extend(reddit_resumes)
        results["sources"]["reddit"] = len(reddit_resumes)
    except Exception as e:
        print(f"Reddit scraper error: {e}")
        results["sources"]["reddit"] = 0

    # Source 2: Google Docs
    print(f"\n Scraping Google Docs...")
    try:
        google_docs_resumes = scrape_resumes_for_company(
            company, role, max_per_source
        )
        # Add region to each resume
        for r in google_docs_resumes:
            r["region"] = region
        all_resumes.extend(google_docs_resumes)
        results["sources"]["google_docs"] = len(google_docs_resumes)
    except Exception as e:
        print(f"Google Docs scraper error: {e}")
        results["sources"]["google_docs"] = 0

    # Source 3: GitHub
    print(f"\n Scraping GitHub...")
    try:
        github_resumes = scrape_github_profiles(
            company, role, max_per_source
        )
        for r in github_resumes:
            r["region"] = region
        all_resumes.extend(github_resumes)
        results["sources"]["github"] = len(github_resumes)
    except Exception as e:
        print(f"GitHub scraper error: {e}")
        results["sources"]["github"] = 0

    # Source 4: Common Crawl
    print(f"\n Scraping Common Crawl...")
    try:
        cc_resumes = scrape_common_crawl(
            company, role, max_per_source
        )
        for r in cc_resumes:
            r["region"] = region
        all_resumes.extend(cc_resumes)
        results["sources"]["common_crawl"] = len(cc_resumes)
    except Exception as e:
        print(f"Common Crawl scraper error: {e}")
        results["sources"]["common_crawl"] = 0

    results["scraped"] = len(all_resumes)
    print(f"\n Total scraped: {len(all_resumes)} resumes")

    # Score and ingest
    print(f"\n🔍 Scoring authenticity...")
    for resume in all_resumes:
        text = resume.get("text", "")
        source = resume.get("source", "unknown")
        outcome = resume.get("outcome", "unknown")
        resume_region = resume.get("region", region)

        auth_result = calculate_authenticity_score(text, source, outcome)

        if auth_result["is_authentic"]:
            results["authentic"] += 1
            try:
                doc_id = str(uuid.uuid4())
                ingest_resume(
                    resume_text=text,
                    company=company,
                    role=role,
                    outcome=outcome,
                    source=source,
                    doc_id=doc_id,
                    region=resume_region
                )
                results["ingested"] += 1
            except Exception as e:
                print(f"Ingest error: {e}")
        else:
            results["rejected"] += 1

    print(f"\n Final Results: {results}")
    return results