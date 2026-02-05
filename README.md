# AyuSuvidha - Ayurvedic Intelligence Assistant

AyuSuvidha is an AI-powered Ayurvedic health assistant that provides personalized wellness recommendations based on classical Ayurvedic texts (Charaka Samhita, Sushruta Samhita, etc.) using RAG (Retrieval Augmented Generation).

## Features
- **AI Chatbot**: Ask questions about Doshas, remedies, and lifestyle.
- **RAG Knowledge Base**: Upload PDF/Text documents to expand AyuSuvidha's knowledge.
- **Admin Dashboard**: Manage users, view system logs, and monitor analytics.
- **Real-time Updates**: Live notifications and status tracking.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, Redis
- **AI Service**: Python, FastAPI, ChromaDB, Gemini/Groq LLM

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- MongoDB (Atlas or Local)
- Redis (Cloud or Local)
- Google Gemini or Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ayusuvidha.git
   cd ayusuvidha
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with your credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **AI Service Setup**
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate # or .\venv\Scripts\Activate on Windows
   pip install -r requirements.txt
   # Create .env file with GEMINI_API_KEY
   uvicorn app.main:app --reload --port 8000
   ```

## License
MIT

