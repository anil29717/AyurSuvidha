from typing import List
import os
import google.generativeai as genai
from functools import lru_cache

# We will prefer Gemini Embeddings if available because it's an API call (Zero RAM overhead)
# instead of loading a heavy local model like SentenceTransformer (PyTorch) which causes OOM on free tier.

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Fallback model if no API key (will consume RAM)
FALLBACK_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
MODEL_NAME = "models/text-embedding-004" if GEMINI_API_KEY else FALLBACK_MODEL_NAME

@lru_cache(maxsize=1)
def get_local_model():
    """
    Lazy-load the sentence transformer model only if absolutely necessary.
    """
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer(FALLBACK_MODEL_NAME)

def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Embed a list of texts using Gemini API (preferred) or local model.
    """
    if not texts:
        return []

    # 1. Try Gemini API
    if GEMINI_API_KEY:
        try:
            # Gemini batch embedding
            # model="models/text-embedding-004" is the latest, or "models/embedding-001"
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=texts,
                task_type="retrieval_document",
                title=None
            )
            # result['embedding'] is a list of lists if input is a list
            if 'embedding' in result:
                return result['embedding']
        except Exception as e:
            print(f"Gemini Embedding API Error: {e}. Falling back to local model (WARNING: High RAM usage).")
    
    # 2. Fallback to Local Model
    print("Using local SentenceTransformer model. This may cause OOM on small instances.")
    model = get_local_model()
    vectors = model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
    return [v.tolist() for v in vectors]
