from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResumeOut(BaseModel):
    id: int
    title: str
    parsed_data: Optional[dict] = None
    ats_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeList(BaseModel):
    id: int
    title: str
    ats_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True