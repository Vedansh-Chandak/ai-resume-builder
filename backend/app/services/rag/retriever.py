import chromadb
from app.services.rag.embeddings import get_embeddings
from app.services.rag.ingest import get_collection


def retrieve_similar_resumes(
    company: str,
    role: str,
    n_results: int = 5
) -> list[str]:
    collection = get_collection()
    embeddings = get_embeddings()

    # Convert query to vector
    query = f"{company} {role} resume"
    vector = embeddings.embed_query(query)

    # Search ChromaDB
    results = collection.query(
        query_embeddings=[vector],
        n_results=n_results,
        where={"company": company.lower()}
    )

    # Return just the resume texts
    if results and results["documents"]:
        return results["documents"][0]
    return []