import anthropic
from app.config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = (
    "You are an expert resume writer and career coach. "
    "You write concise, achievement-focused content using strong action verbs. "
    "Always quantify achievements when possible. "
    "Avoid weak phrases like 'responsible for' or 'helped with'. "
    "Output ONLY the requested content — no preamble, no explanation, no bullet symbols."
)


def _lines(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.strip()]


def _call(prompt: str, max_tokens: int = 1024) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


# ── Per-section prompts ───────────────────────────────────────────────────────

def _prompt_summary(content: dict, context: dict) -> str:
    return (
        f"Write a 3-sentence professional summary for a resume.\n"
        f"Name: {context.get('full_name', 'the candidate')}\n"
        f"Target role: {context.get('target_job_title', 'professional')}\n"
        f"Key skills: {context.get('top_skills', 'not provided')}\n"
        f"Current summary (may be empty): {content.get('text', '')}\n\n"
        "Output only the summary text."
    )


def _prompt_experience(content: dict, context: dict) -> str:
    jobs = content if isinstance(content, list) else [content]
    job = jobs[0] if jobs else {}
    return (
        f"Write 4-5 strong resume bullet points for this role.\n"
        f"Company: {job.get('company', 'unknown')}\n"
        f"Title: {job.get('title', 'unknown')}\n"
        f"Dates: {job.get('dates', 'unknown')}\n"
        f"Target role applying for: {context.get('target_job_title', 'not specified')}\n"
        f"Existing bullets (may be rough or empty): {job.get('bullets', [])}\n\n"
        "Format: one bullet per line, starting with a past-tense action verb. No bullet symbols."
    )


def _prompt_skills(content: dict, context: dict) -> str:
    return (
        f"Suggest a well-organized list of professional skills for a resume.\n"
        f"Target role: {context.get('target_job_title', 'professional')}\n"
        f"Existing skills: {content.get('categories', [])}\n\n"
        "Group by category (e.g. Languages, Frameworks, Tools). "
        "Output one category per line in the format: Category: skill1, skill2, skill3"
    )


def _prompt_projects(content: dict, context: dict) -> str:
    projects = content if isinstance(content, list) else [content]
    proj = projects[0] if projects else {}
    return (
        f"Write 2-3 strong resume bullet points for this project.\n"
        f"Project name: {proj.get('name', 'unknown')}\n"
        f"Technologies: {proj.get('tech', 'not specified')}\n"
        f"Description: {proj.get('description', '')}\n\n"
        "Format: one bullet per line, starting with a past-tense or present-tense action verb. No bullet symbols."
    )


def _prompt_tailor_section(section_text: str, job_description: str, section_type: str) -> str:
    return (
        f"Rewrite this resume {section_type} to better match the job description below.\n"
        f"Incorporate relevant keywords naturally. Keep it concise.\n\n"
        f"Job description:\n---\n{job_description}\n---\n\n"
        f"Current {section_type}:\n---\n{section_text}\n---\n\n"
        f"Output only the rewritten {section_type}."
    )


# ── Public API ────────────────────────────────────────────────────────────────

def get_suggestions(section_type: str, content: dict | list, context: dict) -> list[str]:
    dispatch = {
        "summary": _prompt_summary,
        "experience": _prompt_experience,
        "skills": _prompt_skills,
        "projects": _prompt_projects,
    }
    if section_type not in dispatch:
        return []
    prompt = dispatch[section_type](content, context)
    return _lines(_call(prompt))


def tailor_section(section_text: str, job_description: str, section_type: str) -> str:
    prompt = _prompt_tailor_section(section_text, job_description, section_type)
    return _call(prompt)


def parse_resume_text(raw_text: str) -> dict:
    """Ask Claude to extract structured resume data from plain text."""
    prompt = (
        "Parse the following resume text and extract structured data. "
        "Return valid JSON only, with this exact structure:\n"
        "{\n"
        '  "contact": {"full_name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": ""},\n'
        '  "summary": {"text": ""},\n'
        '  "experience": [{"company": "", "title": "", "dates": "", "bullets": []}],\n'
        '  "education": [{"school": "", "degree": "", "year": "", "gpa": ""}],\n'
        '  "skills": {"categories": [{"name": "", "items": []}]},\n'
        '  "projects": [{"name": "", "tech": "", "description": "", "bullets": []}]\n'
        "}\n\n"
        "Resume text:\n---\n"
        f"{raw_text}\n---\n\n"
        "Output only the JSON object, no other text."
    )
    import json
    raw = _call(prompt, max_tokens=2048)
    # Strip markdown code fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        return {}
