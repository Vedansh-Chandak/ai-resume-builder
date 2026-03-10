from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth
from app.api.routes import resume
from app.api.routes import auth, resume, companies


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,   prefix="/api/auth",   tags=["Auth"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])

@app.get("/")
async def root():
    return {"message": f"{settings.APP_NAME} is running!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

