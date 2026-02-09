from typing import Any, Dict, List, Tuple
import os
from groq import Groq
from dotenv import load_dotenv

from ..core.embeddings import embed_texts
from ..core.chroma_client import add_documents, query as chroma_query
from ..nlp.preprocessing import clean_text, simple_ayur_split

# Load .env file
load_dotenv()

# Configure LLM Providers
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
gemini_client = None

if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    except ImportError:
        print("google-genai package not found. Install it with pip install google-genai")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

def index_document(
    doc_id: str,
    text: str,
    base_metadata: Dict[str, Any] | None = None,
) -> Tuple[int, int]:
    """
    Split raw text into chunks, embed, and store in Chroma.
    Returns (num_chunks, dim).
    """
    base_metadata = base_metadata or {}
    chunks = simple_ayur_split(text)
    clean_chunks = [clean_text(c) for c in chunks]

    embeddings = embed_texts(clean_chunks)
    dim = len(embeddings[0]) if embeddings else 0

    ids = [f"{doc_id}::chunk-{i}" for i in range(len(clean_chunks))]
    metadatas: List[Dict[str, Any]] = []
    for i, c in enumerate(clean_chunks):
        m = dict(base_metadata)
        m["chunk_index"] = i
        m["length"] = len(c)
        metadatas.append(m)

    add_documents(ids=ids, documents=clean_chunks, embeddings=embeddings, metadatas=metadatas)
    return len(clean_chunks), dim


def retrieve_context(query: str, top_k: int = 5) -> Dict[str, Any]:
    cleaned_query = clean_text(query)
    [query_embedding] = embed_texts([cleaned_query])
    result = chroma_query(query_embedding=query_embedding, top_k=top_k)
    return result


def build_prompt(query: str, context_docs: List[str], metadatas: List[Dict[str, Any]]) -> str:
    """
    Construct a system-style prompt for an LLM.
    """
    intro = (
        "You are AyurSuvidha, an assistant grounded in classical Ayurvedic texts. "
        "Use the provided context to answer the user's question with clear, safe guidance. "
        "Always remind users that this is not a substitute for a licensed physician.\n\n"
    )
    ctx_lines: List[str] = []
    for idx, (doc, meta) in enumerate(zip(context_docs, metadatas)):
        source = meta.get("source") or meta.get("grantha") or "Ayurvedic corpus"
        ctx_lines.append(f"[{idx + 1}] Source: {source}\n{doc}\n")

    ctx_block = "\n".join(ctx_lines) if ctx_lines else "No specific context was found.\n"
    user_block = f"User question: {query}\n"
    instructions = (
        "\nAnswer in a concise way, referencing the numbered sources where appropriate. "
        "Avoid making definitive medical diagnoses or prescribing treatments. "
        "Highlight any potential contraindications when herbs and conditions are mentioned."
    )
    return intro + ctx_block + "\n" + user_block + instructions


def generate_answer(prompt: str) -> str:
    """
    Generate answer using Groq (Llama 3) if available, then Gemini, else fallback.
    """
    # 1. Try Groq (Llama-3-70b is fast and good)
    if groq_client:
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            # Fall through to Gemini if Groq fails

    # 2. Try Gemini
    if gemini_client:
        try:
            response = gemini_client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Error communicating with Gemini API: {str(e)}"
    
    return (
        "No active LLM provider found (Groq or Gemini). Please set GROQ_API_KEY or GEMINI_API_KEY. "
        "Here is the context summary:\n\n"
        f"{prompt[:900]}..."
    )


def extract_citations(result: Dict[str, Any]) -> List[Dict[str, Any]]:
    citations: List[Dict[str, Any]] = []
    metadatas = result.get("metadatas") or [[]]
    ids = result.get("ids") or [[]]
    distances = result.get("distances") or [[]]
    
    for row_ids, row_metas, row_dists in zip(ids, metadatas, distances):
        for _id, meta, dist in zip(row_ids, row_metas, row_dists):
            citations.append(
                {
                    "id": _id,
                    "source": (meta or {}).get("source")
                    or (meta or {}).get("grantha")
                    or "Ayurvedic corpus",
                    "chunk_index": (meta or {}).get("chunk_index"),
                    "relevance_score": round(1 - dist, 4) if dist is not None else 0.0 # Approx cosine similarity if dist is cosine distance
                }
            )
    return citations
