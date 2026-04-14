import { useNavigate } from 'react-router-dom'
import { FileText, Trash2, Calendar } from 'lucide-react'
import { Button } from '../ui/Button'
import type { Resume } from '../../types/resume'

interface Props {
  resume: Resume
  onDelete: (id: string) => void
}

export function ResumeCard({ resume, onDelete }: Props) {
  const navigate = useNavigate()
  const date = resume.created_at ? new Date(resume.created_at).toLocaleDateString() : ''

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-600 rounded-lg p-2">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{resume.title}</h3>
            {resume.target_job_title && (
              <p className="text-sm text-gray-500">{resume.target_job_title}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-600 hover:bg-red-50"
          onClick={(e) => { e.stopPropagation(); onDelete(resume.id) }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {date && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </div>
      )}
      <Button size="sm" onClick={() => navigate(`/editor/${resume.id}`)}>
        Open Editor
      </Button>
    </div>
  )
}
