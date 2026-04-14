import { useState } from 'react'
import { suggestForSection } from '../api/ai'
import { useResumeStore } from '../store/resumeStore'
import { toast } from '../components/ui/Toast'

export function useAISuggest() {
  const [loadingSectionId, setLoadingSectionId] = useState<string | null>(null)
  const { setAISuggestions, setActiveSuggestionSectionId, activeResume } = useResumeStore()

  const suggest = async (sectionId: string, sectionType: string, currentContent: unknown) => {
    setLoadingSectionId(sectionId)
    try {
      const context: Record<string, string> = {}
      if (activeResume?.target_job_title) context.target_job_title = activeResume.target_job_title
      const contactSection = activeResume?.sections.find((s) => s.section_type === 'contact')
      if (contactSection?.content && typeof contactSection.content === 'object') {
        const c = contactSection.content as Record<string, string>
        if (c.full_name) context.full_name = c.full_name
      }
      const skillsSection = activeResume?.sections.find((s) => s.section_type === 'skills')
      if (skillsSection?.content) context.top_skills = JSON.stringify(skillsSection.content)

      const { suggestions } = await suggestForSection({
        section_id: sectionId,
        section_type: sectionType,
        current_content: currentContent,
        context,
      })
      setAISuggestions(sectionId, suggestions)
      setActiveSuggestionSectionId(sectionId)
      toast('success', `Got ${suggestions.length} AI suggestions`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI suggestion failed'
      toast('error', message)
    } finally {
      setLoadingSectionId(null)
    }
  }

  return { suggest, loadingSectionId }
}
