# ResumeAI backend

## Required environment

Copy `.env.example` to `.env` and set `DATABASE_URL`, `GROQ_API_KEY`,
`GROQ_MODEL`, and a random `JWT_SECRET_KEY` with at least 32 characters.
`GROQ_MODEL` defaults to `openai/gpt-oss-120b`; set it to another active Groq
model if needed. Set `FRONTEND_URLS` to a comma-separated list of trusted
frontend origins in production.

## Local development

```bash
source .venv/bin/activate
alembic upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Production

Install the deployment dependency set and run migrations before starting
Uvicorn:

```bash
python -m pip install -r requirements-deploy.txt
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
```

The Docker image runs `alembic upgrade head` before starting the server.

## Deploying to Render

This repository includes a [`render.yaml`](../render.yaml) Blueprint for the
frontend, backend, and PostgreSQL database.

1. Create a new Render Blueprint from this repository.
2. Set `GROQ_API_KEY` on `resumeai-backend`.
3. Set `NEXT_PUBLIC_API_URL` on `resumeai-frontend` to the public backend URL,
   for example `https://resumeai-backend.onrender.com`.
4. Set `FRONTEND_URLS` on `resumeai-backend` to the public frontend origin,
   for example `https://resumeai-frontend.onrender.com`.
5. Deploy the Blueprint. The backend container runs Alembic migrations before
   starting Uvicorn.

Render PostgreSQL provides a `postgres://` connection string. The backend
normalizes it to SQLAlchemy's `postgresql+asyncpg://` driver automatically.
