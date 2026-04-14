from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class SectionUpdate(BaseModel):
    content: Any  # flexible JSON per section type


class SectionRead(BaseModel):
    id: str
    resume_id: str
    section_type: str
    order_index: int
    content: Optional[Any] = None
    ai_suggestion: Optional[Any] = None
    updated_at: Optional[datetime] = None
