from functools import lru_cache
from typing import Any, Dict, List

import os
import chromadb
from chromadb.api.models.Collection import Collection

CHROMA_DIR = os.environ.get("CHROMA_DB_PATH", "chroma_db")
DEFAULT_COLLECTION = "ayur_texts"


@lru_cache(maxsize=1)
def get_client() -> chromadb.ClientAPI:
    """
    Persistent ChromaDB client.
    """
    return chromadb.PersistentClient(path=CHROMA_DIR)


@lru_cache(maxsize=4)
def get_collection(name: str = DEFAULT_COLLECTION) -> Collection:
    client = get_client()
    return client.get_or_create_collection(
        name=name,
        metadata={"description": "Ayurvedic texts and protocols for AyurSuvidha"},
    )


def add_documents(
    ids: List[str],
    documents: List[str],
    embeddings: List[List[float]],
    metadatas: List[Dict[str, Any]] | None = None,
    collection_name: str = DEFAULT_COLLECTION,
) -> None:
    col = get_collection(collection_name)
    col.add(ids=ids, documents=documents, embeddings=embeddings, metadatas=metadatas)


def query(
    query_embedding: List[float],
    top_k: int = 5,
    collection_name: str = DEFAULT_COLLECTION,
) -> Dict[str, Any]:
    col = get_collection(collection_name)
    result = col.query(query_embeddings=[query_embedding], n_results=top_k)
    return result


def delete_documents(
    where: Dict[str, Any],
    collection_name: str = DEFAULT_COLLECTION,
) -> None:
    col = get_collection(collection_name)
    col.delete(where=where)


def list_documents(collection_name: str = DEFAULT_COLLECTION) -> List[Dict[str, Any]]:
    col = get_collection(collection_name)
    # Chroma doesn't have a "list unique docs" API, so we fetch all metadatas and aggregate
    # This is inefficient for huge datasets but fine for MVP
    result = col.get(include=["metadatas"])
    metadatas = result.get("metadatas") or []
    
    unique_docs = {}
    for m in metadatas:
        doc_id = m.get("source") # We used filename as source, or we can look at the ID prefix if we stored doc_id in metadata
        # In upload endpoint: base_metadata={"category": category, "source": file.filename}
        # In index_document: ids = [f"{doc_id}::chunk-{i}"...]
        
        # Let's try to extract doc_id from the metadata if possible, or fallback to source
        # Ideally we should have stored 'doc_id' in metadata. 
        # Let's check index_document in pipeline.py... 
        # It adds chunk_index and length. It doesn't explicitly add doc_id to metadata unless passed in base_metadata.
        # But in main.py upload_document, we pass base_metadata={"category": category, "source": file.filename}
        # We assume 'source' is the identifier for now or we rely on the file name.
        
        source = m.get("source", "Unknown")
        category = m.get("category", "General")
        
        if source not in unique_docs:
            unique_docs[source] = {
                "doc_id": source, # Using source/filename as ID for display
                "category": category,
                "chunks": 0
            }
        unique_docs[source]["chunks"] += 1
        
    return list(unique_docs.values())

