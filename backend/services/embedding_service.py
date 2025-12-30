import os
import google.generativeai as genai
from typing import List

class EmbeddingService:
    """Service to generate embeddings using Gemini."""
    
    def __init__(self, model_name: str = "models/text-embedding-004"):
        self.model_name = model_name
        # The API key is already configured in gemini_service.py, 
        # but we ensure it here too just in case.
        if not genai.get_model(model_name):
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    def get_embedding(self, text: str) -> List[float]:
        """Generate a single embedding."""
        result = genai.embed_content(
            model=self.model_name,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate multiple embeddings."""
        result = genai.embed_content(
            model=self.model_name,
            content=texts,
            task_type="retrieval_document"
        )
        return result['embedding']

embedding_service = EmbeddingService()
