from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import GradeResponse, ErrorResponse
from services import gemini_service

app = FastAPI(
    title="Redacao.ai API",
    description="API para correção de redações de concursos públicos usando IA",
    version="1.0.0"
)

# CORS configuration for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "Redacao.ai Backend is running"}


@app.post(
    "/api/grade",
    response_model=GradeResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Grading failed"},
    }
)
async def grade_essay(
    essay: UploadFile = File(..., description="Essay image (JPG, PNG, or WebP)"),
    edital: UploadFile = File(..., description="Edital PDF with grading criteria"),
):
    """
    Grade a handwritten essay using AI.
    
    Accepts:
    - An image of a handwritten essay
    - A PDF of the edital containing the grading criteria
    
    The API uses Gemini to:
    1. Extract grading criteria from the edital PDF
    2. Transcribe the handwritten essay (OCR)
    3. Grade the essay based on the extracted criteria
    
    Returns the transcription and detailed grading feedback.
    """
    # Validate essay file type (images or PDF)
    valid_essay_types = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    if not essay.content_type or essay.content_type not in valid_essay_types:
        raise HTTPException(
            status_code=400,
            detail="Essay file must be an image (JPG, PNG, WebP) or PDF"
        )
    
    # Validate edital file type
    if not edital.content_type or edital.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Edital file must be a PDF"
        )
    
    try:
        # Read file bytes
        essay_bytes = await essay.read()
        edital_bytes = await edital.read()
        
        # Grade the essay using Gemini
        result = await gemini_service.grade_essay(
            essay_image_bytes=essay_bytes,
            edital_pdf_bytes=edital_bytes,
            essay_mime_type=essay.content_type
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to grade essay: {str(e)}"
        )
