from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import resumes, sections, ai, export, upload

app = FastAPI(title="Resume Builder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
app.include_router(sections.router, prefix="/sections", tags=["sections"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(export.router, prefix="/export", tags=["export"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])


@app.get("/health")
def health():
    return {"status": "ok"}
