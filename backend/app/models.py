from pydantic import BaseModel
from typing import List

class AnalysisResponse(BaseModel):
    ats_score: str
    missing_keywords: str
    improved_bullets: str