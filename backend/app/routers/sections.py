import json
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.supabase_client import supabase
from app.schemas.section import SectionUpdate, SectionRead

router = APIRouter()


def _verify_section_owner(section_id: str, user_id: str) -> dict:
    """Return the section if the user owns the parent resume, else raise 404."""
    section = (
        supabase.table("resume_sections")
        .select("*, resumes!inner(user_id)")
        .eq("id", section_id)
        .single()
        .execute()
    )
    if not section.data:
        raise HTTPException(status_code=404, detail="Section not found")
    if section.data["resumes"]["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Section not found")
    return section.data


@router.get("/{section_id}", response_model=SectionRead)
def get_section(section_id: str, current_user: dict = Depends(get_current_user)):
    section = _verify_section_owner(section_id, current_user["id"])
    return section


@router.patch("/{section_id}", response_model=SectionRead)
def update_section(
    section_id: str,
    body: SectionUpdate,
    current_user: dict = Depends(get_current_user),
):
    _verify_section_owner(section_id, current_user["id"])

    content_value = body.content
    # Store as JSON string if it's not already a scalar
    if isinstance(content_value, (dict, list)):
        content_value = json.dumps(content_value)

    result = (
        supabase.table("resume_sections")
        .update({"content": content_value})
        .eq("id", section_id)
        .execute()
    )
    return result.data[0]
