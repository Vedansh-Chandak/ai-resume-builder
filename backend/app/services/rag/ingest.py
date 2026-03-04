import chromadb
from app.services.rag.embeddings import get_embeddings

chroma_client = chromadb.PersistentClient(path="./chroma_db")


def get_collection():
    return chroma_client.get_or_create_collection(
        name="company_resumes",
        metadata={"hnsw:space": "cosine"}
    )


def ingest_resume(
    resume_text: str,
    company: str,
    role: str,
    outcome: str,
    source: str,
    doc_id: str,
    region: str = "usa"
):
    collection = get_collection()
    embeddings = get_embeddings()

    vector = embeddings.embed_query(resume_text)

    collection.add(
        ids=[doc_id],
        embeddings=[vector],
        documents=[resume_text],
        metadatas=[{
            "company": company.lower().strip(),
            "role": role.lower().strip(),
            "region": region.lower().strip(),
            "outcome": outcome,
            "source": source
        }]
    )
    return doc_id


def get_ingested_count(
    company: str = None,
    role: str = None,
    region: str = None
) -> int:
    collection = get_collection()

    where = {}
    if company:
        where["company"] = company.lower().strip()

    if where:
        results = collection.get(where=where)
        return len(results["ids"])

    return collection.count()


def has_enough_data(
    company: str,
    role: str,
    region: str,
    threshold: int = 15
) -> bool:
    """Check if we have enough resumes to skip scraping."""
    collection = get_collection()

    results = collection.get(
        where={
            "company": company.lower().strip(),
            "role": role.lower().strip(),
            "region": region.lower().strip()
        }
    )
    count = len(results["ids"])
    print(f"Found {count} resumes for {company} {role} {region}")
    return count >= threshold