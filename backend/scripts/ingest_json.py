import os
import json
import asyncio
from typing import List, Dict, Any
from dotenv import load_dotenv
import sys

# Add the parent directory (backend root) to sys.path to import services, models, etc.
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

# Set the path to .env before importing services
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
loaded = load_dotenv(env_path, override=True)

if not loaded:
    print(f"⚠️ Warning: load_dotenv returned False for {env_path}")
else:
    print(f"✅ Loaded .env from {env_path}")
    print(f"DEBUG: SUPABASE_URL prefix={os.getenv('SUPABASE_URL')[:15] if os.getenv('SUPABASE_URL') else 'NONE'}")

# Import services AFTER load_dotenv
from services.embedding_service import embedding_service
from services.database_service import database_service

async def ingest_json(file_path: str):
    """Ingest crawler JSON data into Supabase."""
    print(f"📖 Reading data from {file_path}...")
    
    if not os.path.exists(file_path):
        print(f"❌ Error: File {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"✅ Found {len(data)} items. Starting ingestion...")

    for item in data:
        item_type = item.get("type")
        
        if item_type == "prompt":
            print(f"📝 Saving theme: {item.get('title')}")
            try:
                database_service.save_prompt(
                    title=item.get("title"),
                    description=item.get("description"),
                    url=item.get("url")
                )
            except Exception as e:
                print(f"  ❌ Error saving theme: {e}")
        
        elif item_type == "essay":
            print(f"📄 Processing essay: {item.get('title') or '[Untitled]'}")
            text = item.get("text")
            if not text:
                continue
            
            # Generate embedding
            try:
                print(f"  ✨ Generating embedding for {item.get('url')}...")
                embedding = embedding_service.get_embedding(text)
                
                # Save to DB
                database_service.save_corrected_essay(
                    prompt_url=item.get("prompt"),
                    essay_text=text,
                    final_score=item.get("final_score", 0.0),
                    criteria_scores=item.get("criteria_scores", {}),
                    review=item.get("review", ""),
                    comments=item.get("comments", ""),
                    embedding=embedding,
                    title=item.get("title")
                )
            except Exception as e:
                print(f"  ❌ Error processing essay: {e}")

    print("\n✨ Ingestion completed successfully!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_json.py <path_to_json_file>")
    else:
        asyncio.run(ingest_json(sys.argv[1]))
