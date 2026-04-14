import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SectionWrapper } from '../SectionWrapper'
import { Textarea } from '../../ui/Textarea'
import { useAutoSave } from '../../../hooks/useAutoSave'
import { useResumeStore } from '../../../store/resumeStore'
import { parseContent } from '../../../lib/parseContent'
import type { ResumeSection, SummaryContent } from '../../../types/resume'

interface Props { section: ResumeSection }

export function SummarySection({ section }: Props) {
  const parsed = parseContent<SummaryContent>(section.content) ?? {}
  const { register, watch, reset, setValue } = useForm<SummaryContent>({ defaultValues: parsed })
  const values = watch()
  const { aiSuggestions, activeSuggestionSectionId } = useResumeStore()

  useEffect(() => {
    reset(parseContent<SummaryContent>(section.content) ?? {})
  }, [section.id, section.content])

  useAutoSave(section.id, values)

  const handleAcceptSuggestion = (suggestion: string) => {
    setValue('text', suggestion)
  }

  return (
    <SectionWrapper sectionId={section.id} sectionType="summary" title="Professional Summary" currentContent={values}>
      <Textarea label="Summary" rows={5} placeholder="A brief professional summary..." {...register('text')} />
      {activeSuggestionSectionId === section.id && aiSuggestions[section.id]?.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {aiSuggestions[section.id].map((s, i) => (
            <button
              key={i}
              className="text-left text-sm border border-indigo-200 rounded-lg p-2 hover:bg-indigo-50 text-gray-700"
              onClick={() => handleAcceptSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
