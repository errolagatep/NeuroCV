import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { tailorToJob } from '../../api/ai'
import { useResumeStore } from '../../store/resumeStore'
import { toast } from '../ui/Toast'

interface Props { resumeId: string }

export function JobDescriptionInput({ resumeId }: Props) {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { setAISuggestions, setActiveSuggestionSectionId } = useResumeStore()

  const handleTailor = async () => {
    if (!jd.trim()) {
      toast('error', 'Please paste a job description first')
      return
    }
    setLoading(true)
    try {
      const { tailored_sections } = await tailorToJob({ resume_id: resumeId, job_description: jd })
      tailored_sections.forEach(({ section_id, suggestion }) => {
        setAISuggestions(section_id, [suggestion])
        setActiveSuggestionSectionId(section_id)
      })
      toast('success', `Tailored ${tailored_sections.length} sections to the job description`)
      setExpanded(false)
    } catch {
      toast('error', 'Tailoring failed — check your job description')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold text-indigo-800">Tailor to Job Description</h4>
          <p className="text-xs text-indigo-600">Paste a job posting to optimize your resume for it</p>
        </div>
        <Button variant="ghost" size="sm" className="text-indigo-600" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      {expanded && (
        <div className="flex flex-col gap-3 mt-3">
          <Textarea
            rows={6}
            placeholder="Paste the job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <Button loading={loading} onClick={handleTailor}>
            <Wand2 className="h-4 w-4" />
            Tailor Resume
          </Button>
        </div>
      )}
    </div>
  )
}
