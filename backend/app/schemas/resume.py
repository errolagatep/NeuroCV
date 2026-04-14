from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

TemplateId = Literal['classic', 'modern', 'executive', 'compact', 'elegant']


class ResumeCreate(BaseModel):
    title: str
    target_job_title: Optional[str] = None
    template: TemplateId = 'modern'


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_job_title: Optional[str] = None
    job_description: Optional[str] = None
    template: Optional[TemplateId] = None


class ResumeRead(BaseModel):
    id: str
    user_id: str
    title: str
    target_job_title: Optional[str] = None
    job_description: Optional[str] = None
    template: TemplateId = 'modern'
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
