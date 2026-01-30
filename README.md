## AyurAI - Ayurvedic Intelligence Assistant

Monorepo for an enterprise-grade Ayurvedic AI chatbot with:
- React 18 + TypeScript frontend (port 2020)
- Express.js + TypeScript backend (port 2021)
- FastAPI + Python AI/RAG service (port 2022)

### Structure

- `frontend/` - React app (chat UI, landing, admin dashboard)
- `backend/` - Node/Express API (auth, chats, documents, admin, monitoring)
- `ai-service/` - FastAPI service (embeddings, RAG, Gemini integration)

### Getting Started

1. Install dependencies in each subfolder:
   - `cd frontend && npm install`
   - `cd backend && npm install`
   - `cd ai-service && pip install -r requirements.txt`

2. Run services (example):
   - Frontend: `npm run dev` on port 2020
   - Backend: `npm run dev` on port 2021
   - AI Service: `uvicorn app.main:app --reload --port 2022`

