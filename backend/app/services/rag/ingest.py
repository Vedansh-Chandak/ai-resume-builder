import chromadb
from app.services.rag.embeddings import get_embeddings
from app.core.config import settings

# Initialize ChromaDB client
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
    doc_id: str
):
    collection = get_collection()
    embeddings = get_embeddings()

    # Convert text to vector
    vector = embeddings.embed_query(resume_text)

    # Store in ChromaDB
    collection.add(
        ids=[doc_id],
        embeddings=[vector],
        documents=[resume_text],
        metadatas=[{
            "company": company.lower(),
            "role": role.lower(),
            "outcome": outcome,
            "source": source
        }]
    )

    return doc_id

def get_ingested_count(company: str = None) -> int:
    collection = get_collection()
    if company:
        results = collection.get(
            where={"company": company.lower()}
        )
        return len(results["ids"])
    return collection.count()