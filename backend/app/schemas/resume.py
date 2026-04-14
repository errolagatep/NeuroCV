from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ResumeCreate(BaseModel):
    title: str
    target_job_title: Optional[str] = None


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_job_title: Optional[str] = None
    job_description: Optional[str] = None


class ResumeRead(BaseModel):
    id: str
    user_id: str
    title: str
    target_job_title: Optional[str] = None
    job_description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
