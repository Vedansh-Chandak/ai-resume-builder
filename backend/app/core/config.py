from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = "AI Resume Builder"
    APP_ENV: str = "development"
    DEBUG: bool = False

    DATABASE_URL: str = Field(..., description="Async SQLAlchemy database URL")

    GROQ_API_KEY: str = Field(..., min_length=1)
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    JWT_SECRET_KEY: str = Field(..., min_length=32)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    FRONTEND_URL: str = "http://localhost:3000"
    FRONTEND_URLS: str = ""

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def use_async_postgres_driver(cls, value: str) -> str:
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    @property
    def cors_origins(self) -> list[str]:
        configured = [origin.strip() for origin in self.FRONTEND_URLS.split(",") if origin.strip()]
        return configured or [self.FRONTEND_URL]

settings = Settings()