import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { SectionWrapper } from '../SectionWrapper'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import { useAutoSave } from '../../../hooks/useAutoSave'
import { useResumeStore } from '../../../store/resumeStore'
import { parseContent } from '../../../lib/parseContent'
import type { ResumeSection, SkillsContent, SkillCategory } from '../../../types/resume'

interface FormData { categories: SkillCategory[] }
interface Props { section: ResumeSection }

const emptyCategory = (): SkillCategory => ({ name: '', items: [] })

function toCategories(raw: unknown): SkillCategory[] {
  const parsed = parseContent<SkillsContent>(raw)
  return parsed?.categories?.length ? parsed.categories : [emptyCategory()]
}

export function SkillsSection({ section }: Props) {
  const { register, watch, reset, control, setValue } = useForm<FormData>({
    defaultValues: { categories: toCategories(section.content) },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'categories' })
  const values = watch()
  const { aiSuggestions, activeSuggestionSectionId } = useResumeStore()

  useEffect(() => {
    reset({ categories: toCategories(section.content) })
  }, [section.id, section.content])

  useAutoSave(section.id, { categories: values.categories })

  const handleAcceptSuggestion = (suggestion: string) => {
    const lines = suggestion.split('\n').filter(Boolean)
    const newCategories: SkillCategory[] = lines.map((line) => {
      const [name, rest] = line.split(':')
      return { name: name.trim(), items: rest ? rest.split(',').map((s) => s.trim()) : [] }
    })
    if (newCategories.length > 0) setValue('categories', newCategories)
  }

  return (
    <SectionWrapper sectionId={section.id} sectionType="skills" title="Skills" currentContent={{ categories: values.categories }}>
      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Category" placeholder="e.g. Languages" {...register(`categories.${idx}.name`)} />
              <Input
                label="Skills (comma separated)"
                placeholder="Python, TypeScript, Go"
                value={(values.categories[idx]?.items || []).join(', ')}
                onChange={(e) => {
                  const items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  setValue(`categories.${idx}.items`, items)
                }}
              />
            </div>
            {fields.length > 1 && (
              <button type="button" className="mt-6 text-red-400 hover:text-red-600" onClick={() => remove(idx)}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => append(emptyCategory())}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>
      {activeSuggestionSectionId === section.id && aiSuggestions[section.id]?.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-indigo-600 mb-2">AI Suggestions — click to apply all</p>
          <button
            className="text-left text-sm border border-indigo-200 rounded-lg p-3 hover:bg-indigo-50 w-full text-gray-700"
            onClick={() => handleAcceptSuggestion(aiSuggestions[section.id].join('\n'))}
          >
            {aiSuggestions[section.id].join('\n')}
          </button>
        </div>
      )}
    </SectionWrapper>
  )
}
