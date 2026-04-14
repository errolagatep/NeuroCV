export type SectionType = 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects'

export interface ResumeSection {
  id: string
  resume_id: string
  section_type: SectionType
  order_index: number
  content: unknown
  ai_suggestion: unknown
  updated_at?: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  target_job_title?: string
  job_description?: string
  created_at?: string
  updated_at?: string
}

export interface ResumeWithSections extends Resume {
  sections: ResumeSection[]
}

// Content shapes
export interface ContactContent {
  full_name?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
}

export interface SummaryContent {
  text?: string
}

export interface ExperienceEntry {
  company?: string
  title?: string
  dates?: string
  bullets?: string[]
}

export interface EducationEntry {
  school?: string
  degree?: string
  year?: string
  gpa?: string
}

export interface SkillCategory {
  name?: string
  items?: string[]
}

export interface SkillsContent {
  categories?: SkillCategory[]
}

export interface ProjectEntry {
  name?: string
  tech?: string
  description?: string
  bullets?: string[]
}

export interface ParsedResume {
  contact?: ContactContent
  summary?: SummaryContent
  experience?: ExperienceEntry[]
  education?: EducationEntry[]
  skills?: SkillsContent
  projects?: ProjectEntry[]
}
