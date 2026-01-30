from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import io
import pypdf

from .core.embeddings import MODEL_NAME, embed_texts
from .core.chroma_client import get_collection, list_documents, delete_documents

# ... (rest of imports)

# ... (inside models)
class DeleteDocRequest(BaseModel):
    doc_id: str

from .core.dosha import DOSHA_QUESTIONS, calculate_dosha
from .core.symptom_checker import analyze_symptoms
from .core.herbs import get_herb_recommendations
from .core.lifestyle import get_dinacharya, get_seasonal_tips
from .core.treatments import get_remedies, get_detox_programs
from .rag.pipeline import build_prompt, extract_citations, generate_answer, index_document, retrieve_context, GEMINI_API_KEY


class EmbedRequest(BaseModel):
    texts: List[str]
    metadata: Optional[Dict[str, Any]] = None


class HerbRequest(BaseModel):
    dosha: Optional[str] = None
    symptom: Optional[str] = None


class LifestyleRequest(BaseModel):
    dosha: str
    season: Optional[str] = "Any"


class RemedyRequest(BaseModel):
    ailment: str


class DoshaAnswer(BaseModel):
    dosha: str
    weight: int = 10


class DoshaRequest(BaseModel):
    answers: List[DoshaAnswer]


class SymptomRequest(BaseModel):
    symptoms: List[str]


class RagQueryRequest(BaseModel):
    query: str
    user_context: Optional[Dict[str, Any]] = None
    top_k: int = 5


class RagResponse(BaseModel):
    answer: str
    citations: List[Dict[str, Any]] = []
    safety_flags: List[str] = []


class ProcessDocRequest(BaseModel):
    doc_id: str
    text: str
    metadata: Optional[Dict[str, Any]] = None


app = FastAPI(title="AyurAI - AI Service", version="0.2.0")


@app.post("/api/v1/ai/symptom-check")
async def symptom_check(request: SymptomRequest) -> Dict[str, Any]:
    return analyze_symptoms(request.symptoms)


@app.post("/api/v1/ai/herb-recommend")
async def herb_recommend(request: HerbRequest) -> Dict[str, Any]:
    recommendations = get_herb_recommendations(dosha=request.dosha, symptom=request.symptom)
    return {"recommendations": recommendations}


@app.post("/api/v1/ai/lifestyle")
async def get_lifestyle(request: LifestyleRequest) -> Dict[str, Any]:
    routine = get_dinacharya(request.dosha)
    seasonal_tips = get_seasonal_tips(request.season)
    return {
        "routine": routine,
        "seasonal_tips": seasonal_tips
    }


@app.post("/api/v1/ai/remedies")
async def get_remedies_api(request: RemedyRequest) -> Dict[str, Any]:
    remedies = get_remedies(request.ailment)
    return {"remedies": remedies}


@app.get("/api/v1/ai/detox")
async def get_detox_api() -> Dict[str, Any]:
    programs = get_detox_programs()
    return {"programs": programs}


@app.on_event("startup")
async def _warmup() -> None:
    # Touch model and collection so first request is faster.
    _ = get_collection()
    _ = embed_texts(["warming up AyurAI embeddings"])


@app.get("/api/v1/ai/model-status")
async def model_status() -> Dict[str, Any]:
    col = get_collection()
    count = col.count()
    return {
        "service": "ai",
        "status": "ready",
        "embeddings_model": MODEL_NAME,
        "vectors": count,
    }


@app.post("/api/v1/ai/embed")
async def embed(request: EmbedRequest) -> Dict[str, Any]:
    vectors = embed_texts(request.texts)
    dim = len(vectors[0]) if vectors else 0
    return {"embeddings": vectors, "dim": dim}


@app.get("/api/v1/ai/dosha-quiz")
async def get_dosha_quiz() -> Dict[str, Any]:
    return {"questions": DOSHA_QUESTIONS}


@app.post("/api/v1/ai/dosha-calc")
async def calculate_dosha_score(request: DoshaRequest) -> Dict[str, Any]:
    # Convert Pydantic models to dicts
    answers_dicts = [a.model_dump() for a in request.answers]
    result = calculate_dosha(answers_dicts)
    return result


@app.post("/api/v1/ai/rag-query", response_model=RagResponse)
async def rag_query(request: RagQueryRequest) -> RagResponse:
    # 1. Retrieve context via Chroma
    result = retrieve_context(request.query, top_k=request.top_k)

    docs = (result.get("documents") or [[]])[0]
    metadatas = (result.get("metadatas") or [[]])[0]

    # 2. Build a prompt for the LLM
    prompt = build_prompt(request.query, docs, metadatas)

    # 3. Generate answer (currently heuristic, can be replaced with Gemini)
    answer = generate_answer(prompt)

    # 4. Basic safety flags placeholder
    safety_flags: List[str] = []
    lower_q = request.query.lower()
    if any(term in lower_q for term in ["pregnant", "pregnancy", "child", "kid"]):
        safety_flags.append("population_sensitive")

    citations = extract_citations(result)
    return RagResponse(answer=answer, citations=citations, safety_flags=safety_flags)


@app.post("/api/v1/ai/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_id: str = Form(...),
    category: str = Form("general")
) -> Dict[str, Any]:
    """
    Uploads a PDF or Text file, extracts content, and indexes it.
    """
    content = ""
    
    if file.filename.endswith(".pdf"):
        # PDF Extraction
        pdf_bytes = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        for page in pdf_reader.pages:
            content += page.extract_text() + "\n"
    else:
        # Assume Text
        content_bytes = await file.read()
        content = content_bytes.decode("utf-8")

    # Index the content
    # Pass doc_id explicitly in metadata for easier deletion later
    num_chunks, dim = index_document(
        doc_id=doc_id,
        text=content,
        base_metadata={"category": category, "source": file.filename, "doc_id": doc_id}
    )

    return {
        "status": "indexed",
        "doc_id": doc_id,
        "chunks": num_chunks,
        "dim": dim,
        "extracted_length": len(content)
    }


@app.get("/api/v1/ai/docs")
async def get_docs() -> Dict[str, Any]:
    docs = list_documents()
    return {"documents": docs}


@app.post("/api/v1/ai/docs/delete")
async def delete_doc(request: DeleteDocRequest) -> Dict[str, Any]:
    # Delete where metadata['doc_id'] == request.doc_id OR metadata['source'] == request.doc_id
    # Since we are adding 'doc_id' to metadata now, we should prefer that.
    # However, for backward compatibility with previously uploaded files that only have 'source',
    # we might need to handle both or just 'source' if we used filename as ID.
    
    # In list_documents logic, we grouped by 'source'.
    # So the UI will likely send the 'source' (filename) as the ID to delete.
    
    delete_documents(where={"source": request.doc_id})
    return {"status": "deleted", "doc_id": request.doc_id}


@app.post("/api/v1/ai/process-doc")
async def process_doc(request: ProcessDocRequest) -> Dict[str, Any]:
    """
    Accept a raw Ayurvedic document from the Node backend and index in Chroma.
    """
    num_chunks, dim = index_document(
        doc_id=request.doc_id,
        text=request.text,
        base_metadata=request.metadata or {},
    )
    return {
        "status": "indexed",
        "doc_id": request.doc_id,
        "chunks": num_chunks,
        "dim": dim,
    }


@app.post("/api/v1/ai/clear-cache")
async def clear_cache() -> Dict[str, Any]:
    """
    Clears the default Chroma collection for a clean slate.
    """
    col = get_collection()
    col.delete(where={})
    return {"cleared": True}

