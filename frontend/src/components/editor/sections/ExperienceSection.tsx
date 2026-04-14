import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { SectionWrapper } from '../SectionWrapper'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import { Button } from '../../ui/Button'
import { useAutoSave } from '../../../hooks/useAutoSave'
import { parseContent } from '../../../lib/parseContent'
import type { ResumeSection, ExperienceEntry } from '../../../types/resume'

interface FormData { jobs: ExperienceEntry[] }
interface Props { section: ResumeSection }

const emptyJob = (): ExperienceEntry => ({ company: '', title: '', dates: '', bullets: [''] })

function toJobs(raw: unknown): ExperienceEntry[] {
  const parsed = parseContent<ExperienceEntry[]>(raw)
  return Array.isArray(parsed) && parsed.length ? parsed : [emptyJob()]
}

export function ExperienceSection({ section }: Props) {
  const { register, watch, reset, control } = useForm<FormData>({
    defaultValues: { jobs: toJobs(section.content) },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'jobs' })
  const values = watch()

  useEffect(() => {
    reset({ jobs: toJobs(section.content) })
  }, [section.id, section.content])

  useAutoSave(section.id, values.jobs)

  return (
    <SectionWrapper sectionId={section.id} sectionType="experience" title="Experience" currentContent={values.jobs}>
      <div className="flex flex-col gap-6">
        {fields.map((field, idx) => (
          <div key={field.id} className="border border-gray-100 rounded-lg p-4 relative">
            {fields.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                onClick={() => remove(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Input label="Company" {...register(`jobs.${idx}.company`)} />
              <Input label="Job Title" {...register(`jobs.${idx}.title`)} />
              <Input label="Dates" placeholder="Jan 2022 – Present" {...register(`jobs.${idx}.dates`)} />
            </div>
            <Textarea
              label="Bullet points (one per line)"
              rows={5}
              placeholder="Led a team of 5 engineers..."
              value={(values.jobs[idx]?.bullets || []).join('\n')}
              onChange={(e) => {
                const bullets = e.target.value.split('\n')
                reset({ jobs: values.jobs.map((j, i) => i === idx ? { ...j, bullets } : j) })
              }}
            />
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => append(emptyJob())}>
          <Plus className="h-4 w-4" /> Add Job
        </Button>
      </div>
    </SectionWrapper>
  )
}
