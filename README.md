# AI PDF Chatbot

A full-stack AI chatbot that ingests PDF documents, stores embeddings in a vector database, and answers questions using RAG (Retrieval-Augmented Generation). Built with LangChain, LangGraph, Next.js, and Supabase.

## Features

- **PDF Ingestion** — Upload and parse PDFs, store vector embeddings in Supabase
- **Smart Query Routing** — Automatically decides whether to retrieve documents or answer directly
- **Streaming Responses** — Real-time SSE-based chat with response chunks
- **Source Citations** — View which documents were used to generate answers
- **Multi-turn Conversation** — Message history preserved across turns

## Architecture

```
Frontend (Next.js)  ──>  Backend (LangGraph Server)  ──>  Supabase (Vector Store)
     │                         │
     │  Upload PDFs ──>  Ingestion Graph (embed + store)
     │  Ask questions ──>  Retrieval Graph (route → retrieve → generate)
     │                         │
     └── SSE Stream <──────────┘
```

- **Backend**: LangGraph agent graphs for ingestion and retrieval
- **Frontend**: Next.js/React chat UI with file upload
- **Vector Store**: Supabase with OpenAI embeddings (`text-embedding-3-small`)
- **LLM**: OpenAI GPT-4o-mini (configurable)

## Prerequisites

- Node.js v20+
- Yarn
- Supabase project with `documents` table and `match_documents` function ([setup guide](https://js.langchain.com/docs/integrations/vectorstores/supabase/))
- OpenAI API key

## Setup

1. Clone the repo:

```bash
git clone https://github.com/stevez/pdf-chatbot.git
cd pdf-chatbot
```

2. Install dependencies:

```bash
yarn install
```

3. Configure environment variables:

**Backend** (`backend/.env`):
```
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Frontend** (`frontend/.env`):
```
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024
```

## Running Locally

Start the backend (LangGraph server on port 2024):

```bash
cd backend
yarn langgraph:dev
```

Start the frontend (Next.js on port 3000):

```bash
cd frontend
yarn dev
```

Open http://localhost:3000, upload a PDF, and start asking questions.

## Configuration

- **LLM model**: `frontend/constants/graphConfigs.ts` — change `queryModel`
- **Retrieval k value**: `frontend/constants/graphConfigs.ts` — change `k`
- **Prompts**: `backend/src/retrieval_graph/prompts.ts`
- **Vector store**: `backend/src/shared/retrieval.ts`

## Tech Stack

- [LangChain](https://js.langchain.com/) / [LangGraph](https://langchain-ai.github.io/langgraph/) — LLM orchestration
- [Next.js](https://nextjs.org/) — Frontend framework
- [Supabase](https://supabase.com/) — Vector database
- [OpenAI](https://openai.com/) — Embeddings and chat model
- [Turborepo](https://turbo.build/) — Monorepo management
