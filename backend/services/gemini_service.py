"""
Gemini AI Service for essay OCR and grading.
Uses Google's Generative AI library with multimodal capabilities.
"""
import os
import json
import google.generativeai as genai
from typing import Optional

from models import GradeResponse, Criterion
from prompts import get_grading_prompt
from services.embedding_service import embedding_service
from services.database_service import database_service


# Configure Gemini with API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


class GeminiService:
    """Service for interacting with Gemini AI for essay grading."""
    
    def __init__(self, model_name: str = "gemini-3-pro-preview"):
        """
        Initialize the Gemini service.
        
        Args:
            model_name: The Gemini model to use.
        """
        self.model = genai.GenerativeModel(model_name)
    
    async def grade_essay(
        self,
        essay_image_bytes: bytes,
        edital_pdf_bytes: bytes,
        essay_mime_type: str = "image/jpeg",
    ) -> GradeResponse:
        """
        Grade an essay image using criteria extracted from the edital PDF.
        
        Args:
            essay_image_bytes: The raw bytes of the essay image
            edital_pdf_bytes: The raw bytes of the edital PDF
            essay_mime_type: MIME type of the essay image (default: image/jpeg)
        
        Returns:
            GradeResponse with transcription and grading
        
        Raises:
            ValueError: If the response cannot be parsed
        """
        # Phase 1: OCR / Transcription
        ocr_prompt = "Transcreva fielmente o texto desta redação manuscrita. Retorne APENAS o texto transcrito em formato JSON: {\"transcription\": \"...\"}"
        
        image_part = {
            "mime_type": essay_mime_type,
            "data": essay_image_bytes
        }
        
        ocr_response = await self.model.generate_content_async(
            [ocr_prompt, image_part],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        
        try:
            ocr_result = json.loads(ocr_response.text)
            transcription = ocr_result.get("transcription", "")
        except:
            transcription = ocr_response.text # Fallback
            
        # Phase 2: RAG - Search for similar corrections
        try:
            query_embedding = embedding_service.get_embedding(transcription)
            similar_essays = database_service.search_similar_essays(query_embedding, limit=5)
        except Exception as e:
            print(f"⚠️ RAG Search failed: {e}")
            similar_essays = []

        # Phase 3: Final Grading with RAG context
        prompt = get_grading_prompt(references=similar_essays)
        
        pdf_part = {
            "mime_type": "application/pdf",
            "data": edital_pdf_bytes
        }
        
        # Send to Gemini: [prompt, edital PDF, essay image]
        response = await self.model.generate_content_async(
            [prompt, pdf_part, image_part],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )
        
        # Parse the JSON response
        try:
            result = json.loads(response.text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse Gemini response as JSON: {e}")
        
        # Build the response model
        criteria = [
            Criterion(
                name=c["name"],
                max_score=c["max_score"],
                score=c["score"],
                feedback=c["feedback"]
            )
            for c in result.get("criteria", [])
        ]
        
        return GradeResponse(
            transcription=transcription, # Use the transcription from Phase 1 or Gemini's new one
            extracted_criteria_summary=result.get("extracted_criteria_summary"),
            criteria=criteria,
            total_score=result.get("total_score", 0),
            max_total_score=result.get("max_total_score", 100),
            general_feedback=result.get("general_feedback", "")
        )


# Singleton instance
gemini_service = GeminiService()
