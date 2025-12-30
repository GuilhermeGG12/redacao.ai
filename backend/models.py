from pydantic import BaseModel
from typing import List, Optional


class Criterion(BaseModel):
    """Individual grading criterion with score and feedback."""
    name: str
    max_score: float
    score: float
    feedback: str


class GradeResponse(BaseModel):
    """Response model containing transcription and grading."""
    transcription: str
    extracted_criteria_summary: Optional[str] = None
    criteria: List[Criterion]
    total_score: float
    max_total_score: float
    general_feedback: str


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: Optional[str] = None
