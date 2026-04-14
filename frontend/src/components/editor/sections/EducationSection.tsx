import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { SectionWrapper } from '../SectionWrapper'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import { useAutoSave } from '../../../hooks/useAutoSave'
import { parseContent } from '../../../lib/parseContent'
import type { ResumeSection, EducationEntry } from '../../../types/resume'

interface FormData { entries: EducationEntry[] }
interface Props { section: ResumeSection }

const emptyEntry = (): EducationEntry => ({ school: '', degree: '', year: '', gpa: '' })

function toEntries(raw: unknown): EducationEntry[] {
  const parsed = parseContent<EducationEntry[]>(raw)
  return Array.isArray(parsed) && parsed.length ? parsed : [emptyEntry()]
}

export function EducationSection({ section }: Props) {
  const { register, watch, reset, control } = useForm<FormData>({
    defaultValues: { entries: toEntries(section.content) },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'entries' })
  const values = watch()

  useEffect(() => {
    reset({ entries: toEntries(section.content) })
  }, [section.id, section.content])

  useAutoSave(section.id, values.entries)

  return (
    <SectionWrapper sectionId={section.id} sectionType="education" title="Education" currentContent={values.entries} showAI={false}>
      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => (
          <div key={field.id} className="border border-gray-100 rounded-lg p-4 relative">
            {fields.length > 1 && (
              <button type="button" className="absolute top-3 right-3 text-red-400 hover:text-red-600" onClick={() => remove(idx)}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="School" {...register(`entries.${idx}.school`)} />
              <Input label="Degree" placeholder="B.S. Computer Science" {...register(`entries.${idx}.degree`)} />
              <Input label="Graduation Year" placeholder="2024" {...register(`entries.${idx}.year`)} />
              <Input label="GPA (optional)" placeholder="3.8" {...register(`entries.${idx}.gpa`)} />
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => append(emptyEntry())}>
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      </div>
    </SectionWrapper>
  )
}
