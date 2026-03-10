from app.services.rag.embeddings import get_embeddings
from app.services.rag.ingest import get_collection


def retrieve_similar_resumes(
    company: str,
    role: str,
    region: str = "usa",
    n_results: int = 5
) -> list[str]:

    collection = get_collection()
    embeddings = get_embeddings()

    query = f"{company} {role} {region} resume"
    vector = embeddings.embed_query(query)

    try:
        results = collection.query(
            query_embeddings=[vector],
            n_results=n_results,
            where={
                "company": company.lower().strip(),
                "region": region.lower().strip()
            }
        )
        if results and results["documents"][0]:
            return results["documents"][0]
    except Exception:
        pass

    try:
        results = collection.query(
            query_embeddings=[vector],
            n_results=n_results,
            where={"company": company.lower().strip()}
        )
        if results and results["documents"][0]:
            return results["documents"][0]
    except Exception:
        pass

    return []