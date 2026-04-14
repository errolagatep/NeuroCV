from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io
from app.dependencies import get_current_user
from app.supabase_client import supabase
from app.services import export_service

router = APIRouter()


class ExportRequest(BaseModel):
    resume_id: str
    template: str | None = None


def _get_resume_and_sections(resume_id: str, user_id: str):
    resume = (
        supabase.table("resumes")
        .select("*")
        .eq("id", resume_id)
        .eq("user_id", user_id)
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
    return resume.data, sections.data


@router.post("/pdf")
def export_pdf(body: ExportRequest, current_user: dict = Depends(get_current_user)):
    resume, sections = _get_resume_and_sections(body.resume_id, current_user["id"])
    if body.template:
        resume = {**resume, "template": body.template}
    pdf_bytes = export_service.generate_pdf(resume, sections)
    filename = f"{resume.get('title', 'resume').replace(' ', '_')}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/docx")
def export_docx(body: ExportRequest, current_user: dict = Depends(get_current_user)):
    resume, sections = _get_resume_and_sections(body.resume_id, current_user["id"])
    if body.template:
        resume = {**resume, "template": body.template}
    docx_bytes = export_service.generate_docx(resume, sections)
    filename = f"{resume.get('title', 'resume').replace(' ', '_')}.docx"
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
