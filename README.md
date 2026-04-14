# NeuroCV — AI-Powered Resume Builder

NeuroCV is a full-stack web application that helps users build professional resumes with AI assistance. Users fill in their own information across structured sections, and Claude AI helps generate bullet points, write summaries, and tailor the entire resume to a specific job description. Resumes can be exported as PDF or Word, with a choice of 5 professional templates at download time.

---

## Features

- **User accounts** — register and log in via Supabase Auth; all resumes are saved to your account
- **Structured resume editor** — dedicated sections for Contact, Summary, Experience, Education, Skills, and Projects
- **AI Suggest** — per-section AI button that generates achievement-focused bullet points using Claude
- **Tailor to job description** — paste a job posting and Claude rewrites your summary, bullets, and skills to match
- **Resume import** — upload an existing PDF or DOCX resume; Claude parses it and pre-fills all sections
- **5 export templates** — choose a template at export time (Classic, Modern, Executive, Compact, Elegant) for both PDF and Word output
- **Auto-save** — section content saves automatically as you type (1.5 s debounce)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| State | Zustand (auth/UI) + TanStack React Query (server state) |
| Forms | React Hook Form + Zod |
| Backend | Python FastAPI + Uvicorn |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| PDF Export | ReportLab (Platypus) |
| Word Export | python-docx |
| Resume Parsing | pdfplumber + python-docx |

---

## Project Structure

```
AI Based Resume Builder/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint, CORS, router mounting
│   │   ├── config.py             # pydantic-settings (env vars)
│   │   ├── dependencies.py       # JWT auth dependency (Supabase token verification)
│   │   ├── supabase_client.py    # Supabase singleton client
│   │   ├── routers/
│   │   │   ├── resumes.py        # CRUD for resumes (auto-creates 6 sections on POST)
│   │   │   ├── sections.py       # PATCH section content
│   │   │   ├── ai.py             # /ai/suggest and /ai/tailor endpoints
│   │   │   ├── export.py         # /export/pdf and /export/docx (StreamingResponse)
│   │   │   └── upload.py         # /upload/parse (PDF/DOCX → structured JSON via Claude)
│   │   ├── schemas/              # Pydantic request/response models
│   │   └── services/
│   │       ├── ai_service.py     # Claude API calls and prompt builders
│   │       └── export_service.py # Template-aware PDF and DOCX renderers
│   ├── .env                      # Local secrets (gitignored)
│   ├── .env.example              # Template for required env vars
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── logo/                 # Place neurocv-logo.jpg here
│   │   └── _redirects            # SPA fallback for Render static hosting
│   ├── src/
│   │   ├── api/                  # Axios API modules (resumes, sections, ai, export, upload)
│   │   ├── store/                # authStore (Zustand), resumeStore
│   │   ├── pages/                # LoginPage, RegisterPage, DashboardPage, EditorPage
│   │   ├── components/
│   │   │   ├── editor/           # ResumeEditor, SectionWrapper, all 6 section forms,
│   │   │   │                     # AISuggestionPanel, ExportMenu, ExportModal,
│   │   │   │                     # JobDescriptionInput, UploadResumeButton
│   │   │   ├── dashboard/        # ResumeCard, NewResumeModal, TemplateSelector
│   │   │   ├── layout/           # Navbar, ProtectedRoute
│   │   │   └── ui/               # Button, Input, Textarea, Modal, Spinner, Toast,
│   │   │                         # Logo, ErrorBoundary
│   │   ├── hooks/                # useAutoSave, useAISuggest
│   │   ├── lib/                  # supabase.ts, templates.ts, parseContent.ts
│   │   └── types/                # resume.ts, auth.ts
│   ├── .env                      # Local secrets (gitignored)
│   └── .env.example              # Template for required env vars
│
├── supabase_schema.sql           # Run this once in the Supabase SQL editor
├── render.yaml                   # Render deployment config (both services)
└── README.md
```

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Database setup

Open your Supabase project → **SQL Editor** and run `supabase_schema.sql`. Then run the template column migration:

```sql
ALTER TABLE resumes ADD COLUMN template VARCHAR(50) NOT NULL DEFAULT 'modern';
```

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in your values
```

Your `backend/.env` should look like:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
ALLOWED_ORIGINS=http://localhost:5173
```

```bash
# Start the API server
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and fill in your values
```

Your `frontend/.env` should look like:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

```bash
# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`.

---

## Deployment (Render)

The `render.yaml` at the project root defines both services. To deploy:

1. Push the repository to GitHub.
2. Go to [render.com](https://render.com) → **New → Blueprint** → connect your repo.
3. Render will detect `render.yaml` and create both the API and frontend services.
4. Set the required environment variables in the Render dashboard for each service:

**Backend (`neurocv-api`):**

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `ALLOWED_ORIGINS` | Your frontend URL, e.g. `https://neurocv.onrender.com` |

**Frontend (`neurocv`):**

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_API_URL` | Your backend URL, e.g. `https://neurocv-api.onrender.com` |

5. In **Supabase → Authentication → URL Configuration**, add your frontend Render URL to **Allowed Redirect URLs**:
   ```
   https://neurocv.onrender.com/**
   ```

---

## Export Templates

Five templates are available at export time for both PDF and Word formats:

| Template | Style |
|---|---|
| **Classic Professional** | Times New Roman, black only, traditional layout — ATS-safe |
| **Modern Minimal** | Helvetica, indigo accent, clean centered header |
| **Executive** | Dark navy header band, white name, formal structure |
| **Compact Technical** | Two-column layout, maximizes content density — ideal for engineers |
| **Elegant** | Spaced section headings, navy palette, sophisticated and refined |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/resumes` | Create resume (auto-creates all 6 sections) |
| `GET` | `/resumes` | List user's resumes |
| `GET` | `/resumes/{id}` | Get resume with all sections |
| `PATCH` | `/resumes/{id}` | Update title, job description, or template |
| `DELETE` | `/resumes/{id}` | Delete resume and all its sections |
| `PATCH` | `/sections/{id}` | Save section content |
| `POST` | `/ai/suggest` | Generate AI suggestions for one section |
| `POST` | `/ai/tailor` | Tailor resume to a job description |
| `POST` | `/export/pdf` | Download resume as PDF |
| `POST` | `/export/docx` | Download resume as Word document |
| `POST` | `/upload/parse` | Parse an uploaded PDF/DOCX into structured data |
| `GET` | `/health` | Health check |

---

## Logo

Place your logo file at `frontend/public/logo/neurocv-logo.jpg` (also supports `.jpeg`, `.png`, `.webp`). The app auto-detects and falls back to a built-in icon if no logo file is found.

---

## License

MIT
