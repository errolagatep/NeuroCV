import { ContactSection } from './sections/ContactSection'
import { SummarySection } from './sections/SummarySection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import type { ResumeWithSections, ResumeSection } from '../../types/resume'

interface Props { resume: ResumeWithSections }

function findSection(sections: ResumeSection[], type: string): ResumeSection | undefined {
  return sections.find((s) => s.section_type === type)
}

export function ResumeEditor({ resume }: Props) {
  const { sections } = resume

  const contact = findSection(sections, 'contact')
  const summary = findSection(sections, 'summary')
  const experience = findSection(sections, 'experience')
  const education = findSection(sections, 'education')
  const skills = findSection(sections, 'skills')
  const projects = findSection(sections, 'projects')

  return (
    <div className="flex flex-col gap-4">
      <ErrorBoundary>{contact && <ContactSection section={contact} />}</ErrorBoundary>
      <ErrorBoundary>{summary && <SummarySection section={summary} />}</ErrorBoundary>
      <ErrorBoundary>{experience && <ExperienceSection section={experience} />}</ErrorBoundary>
      <ErrorBoundary>{education && <EducationSection section={education} />}</ErrorBoundary>
      <ErrorBoundary>{skills && <SkillsSection section={skills} />}</ErrorBoundary>
      <ErrorBoundary>{projects && <ProjectsSection section={projects} />}</ErrorBoundary>
    </div>
  )
}
