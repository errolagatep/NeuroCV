import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { SectionWrapper } from '../SectionWrapper'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import { Button } from '../../ui/Button'
import { useAutoSave } from '../../../hooks/useAutoSave'
import { parseContent } from '../../../lib/parseContent'
import type { ResumeSection, ProjectEntry } from '../../../types/resume'

interface FormData { projects: ProjectEntry[] }
interface Props { section: ResumeSection }

const emptyProject = (): ProjectEntry => ({ name: '', tech: '', description: '', bullets: [''] })

function toProjects(raw: unknown): ProjectEntry[] {
  const parsed = parseContent<ProjectEntry[]>(raw)
  return Array.isArray(parsed) && parsed.length ? parsed : [emptyProject()]
}

export function ProjectsSection({ section }: Props) {
  const { register, watch, reset, control } = useForm<FormData>({
    defaultValues: { projects: toProjects(section.content) },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' })
  const values = watch()

  useEffect(() => {
    reset({ projects: toProjects(section.content) })
  }, [section.id, section.content])

  useAutoSave(section.id, values.projects)

  return (
    <SectionWrapper sectionId={section.id} sectionType="projects" title="Projects" currentContent={values.projects}>
      <div className="flex flex-col gap-6">
        {fields.map((field, idx) => (
          <div key={field.id} className="border border-gray-100 rounded-lg p-4 relative">
            {fields.length > 1 && (
              <button type="button" className="absolute top-3 right-3 text-red-400 hover:text-red-600" onClick={() => remove(idx)}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Input label="Project Name" {...register(`projects.${idx}.name`)} />
              <Input label="Technologies" placeholder="React, FastAPI, PostgreSQL" {...register(`projects.${idx}.tech`)} />
            </div>
            <Textarea
              label="Bullet points (one per line)"
              rows={4}
              placeholder="Built a full-stack application..."
              value={(values.projects[idx]?.bullets || []).join('\n')}
              onChange={(e) => {
                const bullets = e.target.value.split('\n')
                reset({ projects: values.projects.map((p, i) => i === idx ? { ...p, bullets } : p) })
              }}
            />
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => append(emptyProject())}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>
    </SectionWrapper>
  )
}
