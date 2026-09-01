# Redacao.ai ✍️

Transformando a correção de redações com Inteligência Artificial e RAG (Retrieval-Augmented Generation).

O **Redacao.ai** é uma plataforma SaaS premium que utiliza o Google Gemini para oferecer correções de redações manuscritas com precisão humana, utilizando exemplos reais para calibrar o nível de rigor.

## 🌟 Diferenciais
- **OCR Multimodal**: Transcrição fiel de textos manuscritos a partir de fotos.
- **RAG (Retrieval-Augmented Generation)**: Busca por similaridade em uma base de +3000 redações corrigidas por humanos.
- **Correção Baseada em Edital**: Extração dinâmica de critérios a partir de PDFs oficiais.
- **Design Premium**: Interface moderna desenvolvida com Next.js e Vanilla CSS.

## 🛠️ Stack Tecnológica

### Frontend
- **Framework**: Next.js 14+
- **Estilização**: Modern Vanilla CSS
- **Autenticação**: Clerk
- **Componentes**: Radix UI / Shadcn UI

### Backend
- **Cérebro**: Google Gemini AI (Multimodal)
- **API**: FastAPI (Python 3.11+)
- **Banco de Dados & Vetores**: Supabase (PostgreSQL + pgvector)
- **RAG**: Busca semântica para calibração de notas (Few-Shot Prompting).

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- Conta Supabase (com `pgvector` habilitado)
- Chaves de API: Google Gemini, Clerk e Supabase.

### Passo a Passo

1. **Configuração do Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # No Windows
   pip install -r requirements.txt
   ```
   *Crie o arquivo `.env` na pasta `backend` conforme o `.env.example`.*

2. **Inalação do Banco**:
   ```bash
   python scripts/setup_db.py
   # Copie o código SQL gerado e rode no Supabase SQL Editor.
   ```

3. **Configuração do Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
