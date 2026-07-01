from dotenv import load_dotenv
load_dotenv()                     # ← must be first, before any local imports

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import analyze

app = FastAPI(title="ResuMate AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)

@app.get("/")
def root():
    return {"message": "ResuMate AI backend is running"}