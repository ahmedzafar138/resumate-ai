# ResuMate AI Knowledge

This file is the working summary for the repository. Update it whenever the project structure, runtime flow, dependencies, or API behavior changes.

## What The Project Does

ResuMate AI is a resume analysis app. A user uploads a resume and a job description, and the app returns:

- an ATS-style score
- missing keywords
- improved resume bullet points

The backend parses PDF or DOCX files, chunks and embeds the text, retrieves the most relevant excerpts with FAISS, and asks Gemini to generate the final analysis.

## Root Structure

- [README.md](README.md) - currently empty.
- [knowledge.md](knowledge.md) - canonical project memory and architecture summary.
- [.gitignore](.gitignore) - repository ignore rules.
- [.git](.git) - git metadata.
- [backend/](backend/) - FastAPI backend and document analysis pipeline.
- [frontend/](frontend/) - Vite + React user interface.

## Backend Overview

### Main Entry Points

- [backend/app/main.py](backend/app/main.py) - creates the FastAPI app, enables CORS, and mounts routes.
- [backend/app/routers/analyze.py](backend/app/routers/analyze.py) - defines the `/analyze` endpoint.
- [backend/app/models.py](backend/app/models.py) - Pydantic response model.

### Backend Flow

1. The client posts two files to `POST /analyze`: `resume` and `job_description`.
2. The router validates that both files are `.pdf` or `.docx`.
3. The files are read into bytes and passed to the analyzer.
4. The analyzer parses each file into plain text.
5. The text is chunked into smaller passages.
6. Chunks are embedded with `sentence-transformers`.
7. A FAISS index is built from all chunk embeddings.
8. The analyzer retrieves relevant excerpts for three prompts.
9. Gemini generates the ATS score, missing keywords, and improved bullets.
10. The response is returned as JSON matching `AnalysisResponse`.

### Backend Services

- [backend/app/services/analyzer.py](backend/app/services/analyzer.py) - orchestrates parsing, chunking, embedding, retrieval, and LLM generation.
- [backend/app/services/parser.py](backend/app/services/parser.py) - extracts text from PDF and DOCX files.
- [backend/app/services/chunker.py](backend/app/services/chunker.py) - splits text into sentence-aware chunks.
- [backend/app/services/embedder.py](backend/app/services/embedder.py) - loads `all-MiniLM-L6-v2` and creates embeddings.
- [backend/app/services/vector_store.py](backend/app/services/vector_store.py) - builds and queries the FAISS index.
- [backend/app/services/llm_client.py](backend/app/services/llm_client.py) - wraps the Gemini client and reads `GEMINI_API_KEY`.

### Backend Dependencies

- `fastapi`
- `uvicorn`
- `python-multipart`
- `pdfplumber`
- `python-docx`
- `sentence-transformers`
- `faiss-cpu`
- `google-generativeai`
- `python-dotenv`
- `pydantic`
- `langchain` - listed in requirements, not directly referenced in the current code shown here.

### Backend Environment

- [backend/.env](backend/.env) - local environment variables.
- [backend/.env.example](backend/.env.example) - sample environment file.

The current backend code expects `GEMINI_API_KEY` to be set.

## Frontend Overview

### Main Entry Points

- [frontend/src/main.jsx](frontend/src/main.jsx) - Vite bootstrapping entry.
- [frontend/src/App.jsx](frontend/src/App.jsx) - main app UI and API call orchestration.

### Frontend Flow

1. The user first signs in or creates an account with Supabase.
2. If the user forgot their password, the frontend sends a Supabase reset email.
3. After login, the app shows the analyzer shell.
4. The user selects a resume file and a job description file.
5. `UploadForm` validates that both files are present.
6. `App.jsx` sends them to `/analyze` with `multipart/form-data`.
7. While the request is in flight, the UI shows an analyzing state.
8. On success, the response is passed into the score, keywords, and bullets display components.
9. On failure, the app shows the backend error or a fallback message.

### Frontend Components

- [frontend/src/components/UploadForm.jsx](frontend/src/components/UploadForm.jsx) - file upload form and submit button.
- [frontend/src/components/ScoreCard.jsx](frontend/src/components/ScoreCard.jsx) - displays ATS score output.
- [frontend/src/components/KeywordsList.jsx](frontend/src/components/KeywordsList.jsx) - displays missing keywords.
- [frontend/src/components/BulletsList.jsx](frontend/src/components/BulletsList.jsx) - displays improved bullets.

### Frontend Dependencies

- `react`
- `react-dom`
- `axios`
- `@supabase/supabase-js`
- `vite`
- `@vitejs/plugin-react`
- `tailwindcss`
- `postcss`
- `autoprefixer`

### Frontend Environment

- [frontend/.env.example](frontend/.env.example) - sample Supabase env file.

The current frontend code expects:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notable Project Points

- The backend is the source of truth for analysis logic.
- The frontend is thin and only handles file selection, request submission, loading state, and result rendering.
- The frontend now gates the analyzer behind Supabase auth and adds sign in, sign up, logout, name editing, and forgot-password support.
- The API currently allows all CORS origins.
- The response model is string-based, so the UI expects formatted text rather than structured JSON arrays.
- The project uses a local embedding model and an external Gemini API call in the same request flow.
- `frontend/tmp/test-resumate/` looks like a temporary scaffold or sample app and is not part of the main runtime path.

## Current Runtime Expectations

- Backend startup happens from `backend/app/main.py`.
- The app exposes a health-like root route at `/` that returns a simple status message.
- Analysis is exposed only through `POST /analyze`.
- The backend requires installed native-compatible dependencies for FAISS and the sentence transformer model download on first use.
- The frontend requires Supabase env vars before login will work.

## Setup Commands

Backend:

- `cd backend`
- `python -m venv venv`
- `venv\Scripts\activate`
- `pip install -r requirements.txt`
- `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`

Frontend:

- `cd frontend`
- `npm install`
- `npm run dev`

Auth setup:

- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `frontend/.env`.
- Configure Supabase email/password auth in the Supabase dashboard.
- Add your local dev redirect URL to the Supabase auth redirect allow-list if password reset confirmation is used.

## Keeping This File Current

- Update this file whenever you change routes, services, env vars, dependencies, file locations, or UI flow.
- If a new feature is added, add its entry points and how it fits into the request flow.
- If files are removed or renamed, update the root structure and references here in the same change.