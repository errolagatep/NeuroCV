import io
import json
from typing import Any


# ── Helper ────────────────────────────────────────────────────────────────────

def _parse_content(raw: Any) -> Any:
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            return {}
    return raw or {}


def _section_map(sections: list[dict]) -> dict:
    result = {}
    for s in sections:
        result[s["section_type"]] = _parse_content(s.get("content"))
    return result


# ── PDF ───────────────────────────────────────────────────────────────────────

def generate_pdf(resume: dict, sections: list[dict]) -> bytes:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
    from reportlab.lib.enums import TA_CENTER

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    styles = getSampleStyleSheet()
    name_style = ParagraphStyle("Name", parent=styles["Normal"], fontSize=20, leading=24, alignment=TA_CENTER, spaceAfter=4)
    contact_style = ParagraphStyle("Contact", parent=styles["Normal"], fontSize=9, alignment=TA_CENTER, spaceAfter=6)
    section_header_style = ParagraphStyle("SectionHeader", parent=styles["Normal"], fontSize=11, leading=14, spaceBefore=10, spaceAfter=3, textColor=colors.HexColor("#1a1a1a"), fontName="Helvetica-Bold")
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=13)
    bullet_style = ParagraphStyle("Bullet", parent=styles["Normal"], fontSize=10, leading=13, leftIndent=14, firstLineIndent=-10)
    sub_style = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=10, leading=13, fontName="Helvetica-Bold")

    sm = _section_map(sections)
    story = []

    # Contact
    contact = sm.get("contact", {})
    name = contact.get("full_name") or resume.get("title", "Resume")
    story.append(Paragraph(name, name_style))

    contact_parts = [p for p in [
        contact.get("email"), contact.get("phone"), contact.get("location"),
        contact.get("linkedin"), contact.get("github"),
    ] if p]
    if contact_parts:
        story.append(Paragraph(" · ".join(contact_parts), contact_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#333333")))

    # Summary
    summary = sm.get("summary", {})
    summary_text = summary.get("text", "") if isinstance(summary, dict) else ""
    if summary_text:
        story.append(Paragraph("SUMMARY", section_header_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        story.append(Paragraph(summary_text, body_style))

    # Experience
    experience = sm.get("experience", [])
    if isinstance(experience, list) and experience:
        story.append(Paragraph("EXPERIENCE", section_header_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        for job in experience:
            if not isinstance(job, dict):
                continue
            story.append(Spacer(1, 6))
            title_company = f"{job.get('title', '')} — {job.get('company', '')}"
            story.append(Paragraph(title_company, sub_style))
            if job.get("dates"):
                story.append(Paragraph(job["dates"], body_style))
            for bullet in job.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", bullet_style))

    # Education
    education = sm.get("education", [])
    if isinstance(education, list) and education:
        story.append(Paragraph("EDUCATION", section_header_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        for edu in education:
            if not isinstance(edu, dict):
                continue
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"{edu.get('degree', '')} — {edu.get('school', '')}", sub_style))
            detail_parts = [p for p in [edu.get("year"), edu.get("gpa") and f"GPA: {edu['gpa']}"] if p]
            if detail_parts:
                story.append(Paragraph(", ".join(detail_parts), body_style))

    # Skills
    skills = sm.get("skills", {})
    categories = skills.get("categories", []) if isinstance(skills, dict) else []
    if categories:
        story.append(Paragraph("SKILLS", section_header_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        story.append(Spacer(1, 4))
        for cat in categories:
            if isinstance(cat, dict):
                cat_name = cat.get("name", "")
                items = ", ".join(cat.get("items", []))
                story.append(Paragraph(f"<b>{cat_name}:</b> {items}", body_style))

    # Projects
    projects = sm.get("projects", [])
    if isinstance(projects, list) and projects:
        story.append(Paragraph("PROJECTS", section_header_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#aaaaaa")))
        for proj in projects:
            if not isinstance(proj, dict):
                continue
            story.append(Spacer(1, 6))
            proj_line = proj.get("name", "")
            if proj.get("tech"):
                proj_line += f" — {proj['tech']}"
            story.append(Paragraph(proj_line, sub_style))
            for bullet in proj.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", bullet_style))

    doc.build(story)
    return buf.getvalue()


# ── DOCX ──────────────────────────────────────────────────────────────────────

def generate_docx(resume: dict, sections: list[dict]) -> bytes:
    from docx import Document
    from docx.shared import Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH

    doc = Document()

    # Remove default margins
    section_obj = doc.sections[0]
    section_obj.top_margin = section_obj.bottom_margin = Pt(54)
    section_obj.left_margin = section_obj.right_margin = Pt(54)

    sm = _section_map(sections)

    def add_section_heading(title: str):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(title)
        run.bold = True
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)
        p.paragraph_format.border_bottom = True

    # Name / contact
    contact = sm.get("contact", {})
    name = contact.get("full_name") or resume.get("title", "Resume")
    name_para = doc.add_paragraph(name)
    name_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name_para.runs[0].bold = True
    name_para.runs[0].font.size = Pt(20)

    contact_parts = [p for p in [
        contact.get("email"), contact.get("phone"), contact.get("location"),
        contact.get("linkedin"), contact.get("github"),
    ] if p]
    if contact_parts:
        cp = doc.add_paragraph(" · ".join(contact_parts))
        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cp.runs[0].font.size = Pt(9)

    # Summary
    summary = sm.get("summary", {})
    summary_text = summary.get("text", "") if isinstance(summary, dict) else ""
    if summary_text:
        add_section_heading("SUMMARY")
        doc.add_paragraph(summary_text)

    # Experience
    experience = sm.get("experience", [])
    if isinstance(experience, list) and experience:
        add_section_heading("EXPERIENCE")
        for job in experience:
            if not isinstance(job, dict):
                continue
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            run = p.add_run(f"{job.get('title', '')} — {job.get('company', '')}")
            run.bold = True
            if job.get("dates"):
                doc.add_paragraph(job["dates"])
            for bullet in job.get("bullets", []):
                bp = doc.add_paragraph(bullet, style="List Bullet")
                bp.paragraph_format.left_indent = Pt(14)

    # Education
    education = sm.get("education", [])
    if isinstance(education, list) and education:
        add_section_heading("EDUCATION")
        for edu in education:
            if not isinstance(edu, dict):
                continue
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            run = p.add_run(f"{edu.get('degree', '')} — {edu.get('school', '')}")
            run.bold = True
            detail_parts = [p for p in [edu.get("year"), edu.get("gpa") and f"GPA: {edu['gpa']}"] if p]
            if detail_parts:
                doc.add_paragraph(", ".join(detail_parts))

    # Skills
    skills = sm.get("skills", {})
    categories = skills.get("categories", []) if isinstance(skills, dict) else []
    if categories:
        add_section_heading("SKILLS")
        for cat in categories:
            if isinstance(cat, dict):
                p = doc.add_paragraph()
                run_name = p.add_run(f"{cat.get('name', '')}: ")
                run_name.bold = True
                p.add_run(", ".join(cat.get("items", [])))

    # Projects
    projects = sm.get("projects", [])
    if isinstance(projects, list) and projects:
        add_section_heading("PROJECTS")
        for proj in projects:
            if not isinstance(proj, dict):
                continue
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            proj_line = proj.get("name", "")
            if proj.get("tech"):
                proj_line += f" — {proj['tech']}"
            run = p.add_run(proj_line)
            run.bold = True
            for bullet in proj.get("bullets", []):
                bp = doc.add_paragraph(bullet, style="List Bullet")
                bp.paragraph_format.left_indent = Pt(14)

    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()
