import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.supabase_client import supabase
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeRead

router = APIRouter()

SECTION_TYPES = ["contact", "summary", "experience", "education", "skills", "projects"]


@router.get("", response_model=list[ResumeRead])
def list_resumes(current_user: dict = Depends(get_current_user)):
    result = (
        supabase.table("resumes")
        .select("*")
        .eq("user_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("", response_model=ResumeRead, status_code=status.HTTP_201_CREATED)
def create_resume(body: ResumeCreate, current_user: dict = Depends(get_current_user)):
    resume_id = str(uuid.uuid4())
    resume_data = {
        "id": resume_id,
        "user_id": current_user["id"],
        "title": body.title,
        "target_job_title": body.target_job_title,
        "template": body.template,
    }
    result = supabase.table("resumes").insert(resume_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create resume")

    # Auto-create all 6 sections
    sections = [
        {
            "id": str(uuid.uuid4()),
            "resume_id": resume_id,
            "section_type": section_type,
            "order_index": i,
            "content": None,
            "ai_suggestion": None,
        }
        for i, section_type in enumerate(SECTION_TYPES)
    ]
    supabase.table("resume_sections").insert(sections).execute()

    return result.data[0]


@router.get("/{resume_id}")
def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = (
        supabase.table("resumes")
        .select("*")
        .eq("id", resume_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not resume.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    sections = (
        supabase.table("resume_sections")
        .select("*")
        .eq("resume_id", resume_id)
        .order("order_index")
        .execute()
    )
    return {**resume.data, "sections": sections.data}


@router.patch("/{resume_id}", response_model=ResumeRead)
def update_resume(
    resume_id: str,
    body: ResumeUpdate,
    current_user: dict = Depends(get_current_user),
):
    # Verify ownership
    existing = (
        supabase.table("resumes")
        .select("id")
        .eq("id", resume_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("resumes")
        .update(updates)
        .eq("id", resume_id)
        .execute()
    )
    return result.data[0]


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    existing = (
        supabase.table("resumes")
        .select("id")
        .eq("id", resume_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not existing.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Sections cascade delete via DB foreign key
    supabase.table("resumes").delete().eq("id", resume_id).execute()
