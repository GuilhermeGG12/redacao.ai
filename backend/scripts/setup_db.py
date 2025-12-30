import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

# Path to the .env file in the backend directory
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
loaded = load_dotenv(env_path, override=True)

if not loaded:
    print(f"⚠️ Warning: load_dotenv returned False for {env_path}")
    if os.path.exists(env_path):
        print(f"📄 File exists at {env_path}, size: {os.path.getsize(env_path)} bytes")
    else:
        print(f"❌ File DOES NOT exist at {env_path}")

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url and os.path.exists(env_path):
    print("🔎 Detectado URL vazio. Tentando leitura manual do arquivo...")
    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"📄 Conteúdo bruto do .env (primeiros 50 bytes): {repr(content[:50])}")

print(f"DEBUG: env_path={env_path}")
print(f"DEBUG: SUPABASE_URL prefix={url[:15] if url else 'NONE'}")
print(f"DEBUG: SUPABASE_SERVICE_ROLE_KEY found={'Yes' if key else 'No'}")

async def setup_database():
    if not url or not key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not found in .env")
        return

    print("🚀 Supabase Database Setup Guide")
    print("=" * 40)
    
    sql_script = """
-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create themes table
CREATE TABLE IF NOT EXISTS prompts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);

-- 3. Create corrected essays table
CREATE TABLE IF NOT EXISTS corrected_essays (
    id BIGSERIAL PRIMARY KEY,
    prompt_url TEXT REFERENCES prompts(url),
    title TEXT,
    essay_text TEXT NOT NULL,
    final_score FLOAT,
    criteria_scores JSONB,
    review TEXT,
    comments TEXT,
    embedding VECTOR(768) -- Support for Gemini text-embedding-004
);

-- 4. Create the similarity search function
CREATE OR REPLACE FUNCTION match_essays (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  prompt_url TEXT,
  title TEXT,
  essay_text TEXT,
  final_score FLOAT,
  criteria_scores JSONB,
  review TEXT,
  comments TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.prompt_url,
    ce.title,
    ce.essay_text,
    ce.final_score,
    ce.criteria_scores,
    ce.review,
    ce.comments,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM corrected_essays ce
  WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY (ce.embedding <=> query_embedding) ASC
  LIMIT match_count;
END;
$$;
"""
    
    print("\nPlease run the following SQL script in your Supabase SQL Editor:")
    print("-" * 20)
    print(sql_script)
    print("-" * 20)
    print("\nAfter running this script, your database will be ready for RAG!")

if __name__ == "__main__":
    asyncio.run(setup_database())
