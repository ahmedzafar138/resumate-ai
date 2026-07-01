from fastapi import APIRouter, UploadFile, File, HTTPException
from ..models import AnalysisResponse
from ..services.analyzer import analyze

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...)
):
    if not resume.filename.endswith(('.pdf', '.docx')) or not job_description.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(400, "Both files must be PDF or DOCX.")
    resume_bytes = await resume.read()
    jd_bytes = await job_description.read()
    try:
        result = analyze(resume_bytes, resume.filename, jd_bytes, job_description.filename)
        return result
    except Exception as e:
        raise HTTPException(500, str(e))