import os
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class DatabaseService:
    """Service to handle interactions with Supabase Vector."""
    
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
        self.supabase: Client = create_client(url, key)

    def save_prompt(self, title: str, description: str, url: str) -> Dict[str, Any]:
        """Save an essay prompt (theme)."""
        data = {
            "title": title,
            "description": description,
            "url": url
        }
        result = self.supabase.table("prompts").upsert(data, on_conflict="url").execute()
        return result.data[0] if result.data else {}

    def save_corrected_essay(
        self, 
        prompt_url: str, 
        essay_text: str, 
        final_score: float, 
        criteria_scores: Dict[str, float],
        review: str,
        comments: str,
        embedding: List[float],
        title: Optional[str] = None
    ) -> Dict[str, Any]:
        """Save a corrected essay with its embedding."""
        data = {
            "prompt_url": prompt_url,
            "title": title,
            "essay_text": essay_text,
            "final_score": final_score,
            "criteria_scores": criteria_scores,
            "review": review,
            "comments": comments,
            "embedding": embedding
        }
        result = self.supabase.table("corrected_essays").insert(data).execute()
        return result.data[0] if result.data else {}

    def search_similar_essays(self, embedding: List[float], limit: int = 3) -> List[Dict[str, Any]]:
        """Search for similar corrected essays using pgvector."""
        result = self.supabase.rpc(
            "match_essays", 
            {
                "query_embedding": embedding,
                "match_threshold": 0.5,
                "match_count": limit
            }
        ).execute()
        return result.data

database_service = DatabaseService()
