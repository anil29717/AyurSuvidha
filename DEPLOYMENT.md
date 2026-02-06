# AyuSuvidha Deployment Guide

This guide will help you deploy the Frontend to **Vercel** and the Backend & AI Service to **Render**.

## 1. Prerequisites
- GitHub Repository with your code pushed.
- Accounts on [Vercel](https://vercel.com) and [Render](https://render.com).
- **MongoDB Atlas** database URI.
- **Redis** connection string (e.g., from Redis Cloud or Render Redis).
- **Google Gemini** or **Groq** API Key.

---

## 2. Deploy AI Service (Render)
**Important Note on Database Persistence:**
The AI Service uses ChromaDB (local file database). On Render's **Free Tier**, the file system is ephemeral, meaning **all uploaded documents/vectors will be lost** if the service restarts or redeploys.
To keep your data, you must either:
1.  Upgrade to a paid Render plan and add a **Persistent Disk**.
2.  Or accept that you need to re-upload documents after every deployment (okay for demos).

**Steps:**
1.  **New Web Service** on Render.
2.  Connect your GitHub repo.
3.  **Root Directory**: `ai-service`
4.  **Runtime**: Python 3
5.  **Build Command**: `pip install -r requirements.txt`
6.  **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
7.  **Environment Variables**:
    - `GEMINI_API_KEY`: *your_gemini_key*
    - `GROQ_API_KEY`: *your_groq_key* (optional)
    - `PYTHON_VERSION`: `3.10.0`
    - `CHROMA_DB_PATH`: `/var/lib/chroma` (Only if using Persistent Disk, otherwise leave default or `/opt/render/project/src/chroma_db`)

**If using Persistent Disk (Paid):**
- Go to "Disks" tab in your service.
- **Mount Path**: `/var/lib/chroma`
- **Size**: 1 GB is usually enough.

8.  **Deploy**.
9.  **Copy the Service URL** (e.g., `https://ayusuvidha-ai.onrender.com`).

---

## 3. Deploy Backend (Render)
1.  **New Web Service** on Render.
2.  Connect your GitHub repo.
3.  **Root Directory**: `backend`
4.  **Runtime**: Node
5.  **Build Command**: `npm install && npm run build`
6.  **Start Command**: `npm start` (Make sure `package.json` has `"start": "node dist/server.js"`)
7.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `PORT`: `10000` (Render default)
    - `MONGO_URI`: *your_mongodb_atlas_uri*
    - `REDIS_URL`: *your_redis_url*
    - `JWT_SECRET`: *generate_a_secure_secret*
    - `AI_SERVICE_URL`: *The URL from Step 2* (e.g., `https://ayusuvidha-ai.onrender.com`)
    - `FRONTEND_URL`: *The URL you WILL get from Vercel* (e.g., `https://ayusuvidha.vercel.app`) - *You can update this later*
8.  **Deploy**.
9.  **Copy the Service URL** (e.g., `https://ayusuvidha-backend.onrender.com`).

---

## 4. Deploy Frontend (Vercel)
1.  **Add New Project** on Vercel.
2.  Import your GitHub repo.
3.  **Root Directory**: `frontend`
4.  **Framework Preset**: Vite
5.  **Environment Variables**:
    - `VITE_API_URL`: *The URL from Step 3* + `/api/v1` (e.g., `https://ayusuvidha-backend.onrender.com/api/v1`)
6.  **Deploy**.
7.  **Copy the Deployment URL** (e.g., `https://ayusuvidha.vercel.app`).

---

## 5. Final Configuration
1.  Go back to **Render (Backend Service)**.
2.  Update `FRONTEND_URL` environment variable with your Vercel URL.
3.  **Redeploy** the backend if needed (Render usually auto-deploys on env change).

## Troubleshooting
- **CORS Errors**: Ensure `FRONTEND_URL` in Backend matches your Vercel URL exactly (no trailing slash).
- **Socket Connection Failed**: Ensure your Vercel app can reach the Render backend. Check `VITE_API_URL` is correct.
- **AI Service 503/Timeout**: The AI service on Render free tier spins down after inactivity. The first request might take 50s+ to wake it up.

## Verification
- Visit your Vercel URL.
- Login/Register.
- Check "Online & Ready" status in chat.
- Send a message and verify response.
