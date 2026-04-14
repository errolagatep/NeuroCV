import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Any, Optional
from app.dependencies import get_current_user
from app.supabase_client import supabase
from app.services import ai_service

router = APIRouter()


class SuggestRequest(BaseModel):
    section_id: str
    section_type: str
    current_content: Any
    context: Optional[dict] = {}


class TailorRequest(BaseModel):
    resume_id: str
    job_description: str


@router.post("/suggest")
def suggest(body: SuggestRequest, current_user: dict = Depends(get_current_user)):
    suggestions = ai_service.get_suggestions(
        section_type=body.section_type,
        content=body.current_content or {},
        context=body.context or {},
    )
    if not suggestions:
        raise HTTPException(status_code=400, detail=f"No AI suggestions available for section type '{body.section_type}'")

    # Persist suggestion back to DB
    supabase.table("resume_sections").update(
        {"ai_suggestion": json.dumps(suggestions)}
    ).eq("id", body.section_id).execute()

    return {"suggestions": suggestions}


@router.post("/tailor")
def tailor(body: TailorRequest, current_user: dict = Depends(get_current_user)):
    # Verify ownership
    resume = (
        supabase.table("resumes")
        .select("*")
        .eq("id", body.resume_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not resume.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    sections = (
        supabase.table("resume_sections")
        .select("*")
        .eq("resume_id", body.resume_id)
        .in_("section_type", ["summary", "experience", "skills"])
        .execute()
    )

    tailored = []
    for section in sections.data:
        content = section.get("content")
        if not content:
            continue
        if isinstance(content, str):
            try:
                content_obj = json.loads(content)
            except json.JSONDecodeError:
                content_obj = {"text": content}
        else:
            content_obj = content

        section_text = (
            content_obj.get("text", "")
            if section["section_type"] == "summary"
            else json.dumps(content_obj)
        )
        if not section_text.strip():
            continue

        rewritten = ai_service.tailor_section(
            section_text=section_text,
            job_description=body.job_description,
            section_type=section["section_type"],
        )
        supabase.table("resume_sections").update(
            {"ai_suggestion": json.dumps([rewritten])}
        ).eq("id", section["id"]).execute()

        tailored.append({"section_id": section["id"], "section_type": section["section_type"], "suggestion": rewritten})

    # Save job description on resume
    supabase.table("resumes").update({"job_description": body.job_description}).eq("id", body.resume_id).execute()

    return {"tailored_sections": tailored}
