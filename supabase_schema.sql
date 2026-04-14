-- Run this in your Supabase SQL editor to set up the database

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_job_title TEXT,
  job_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume sections table
CREATE TABLE IF NOT EXISTS resume_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('contact', 'summary', 'experience', 'education', 'skills', 'projects')),
  order_index INTEGER NOT NULL DEFAULT 0,
  content TEXT,        -- JSON string
  ai_suggestion TEXT,  -- JSON string
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_sections_resume_id ON resume_sections(resume_id);

-- Auto-update updated_at on resumes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER sections_updated_at
  BEFORE UPDATE ON resume_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (optional but recommended for production)
-- ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users own resumes" ON resumes USING (auth.uid() = user_id);
-- CREATE POLICY "Users own sections via resumes" ON resume_sections
--   USING (EXISTS (SELECT 1 FROM resumes WHERE id = resume_id AND user_id = auth.uid()));
