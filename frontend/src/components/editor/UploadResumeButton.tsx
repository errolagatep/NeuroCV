import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '../ui/Button'
import { parseUploadedResume } from '../../api/upload'
import { updateSection } from '../../api/sections'
import { useResumeStore } from '../../store/resumeStore'
import { toast } from '../ui/Toast'
export function UploadResumeButton() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const { activeResume, setActiveResume } = useResumeStore()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const { parsed } = await parseUploadedResume(file)
      // Push parsed data into each matching section
      if (!activeResume) return

      const updated = { ...activeResume, sections: [...activeResume.sections] }
      const sectionMap: Record<string, unknown> = {
        contact: parsed.contact,
        summary: parsed.summary,
        experience: parsed.experience,
        education: parsed.education,
        skills: parsed.skills,
        projects: parsed.projects,
      }

      for (const section of updated.sections) {
        const content = sectionMap[section.section_type]
        if (content !== undefined) {
          await updateSection(section.id, content)
          const idx = updated.sections.findIndex((s) => s.id === section.id)
          updated.sections[idx] = { ...section, content }
        }
      }

      setActiveResume(updated)
      toast('success', 'Resume parsed and imported! Review each section.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to parse resume'
      toast('error', message)
    } finally {
      setLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFile}
      />
      <Button variant="secondary" size="sm" loading={loading} onClick={() => fileRef.current?.click()}>
        <Upload className="h-4 w-4" />
        Import Resume
      </Button>
    </>
  )
}
