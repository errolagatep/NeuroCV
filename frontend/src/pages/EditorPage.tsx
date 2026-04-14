import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { getResume } from '../api/resumes'
import { Navbar } from '../components/layout/Navbar'
import { ResumeEditor } from '../components/editor/ResumeEditor'
import { JobDescriptionInput } from '../components/editor/JobDescriptionInput'
import { ExportMenu } from '../components/editor/ExportMenu'
import { UploadResumeButton } from '../components/editor/UploadResumeButton'
import { Spinner } from '../components/ui/Spinner'
import { useResumeStore } from '../store/resumeStore'

export function EditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>()
  const { setActiveResume, activeResume } = useResumeStore()

  const { data: resume, isLoading, error } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId!),
    enabled: !!resumeId,
  })

  useEffect(() => {
    if (resume) setActiveResume(resume)
    return () => setActiveResume(null)
  }, [resume])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-gray-500">Resume not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{resume.title}</h1>
              {resume.target_job_title && (
                <p className="text-sm text-gray-500">{resume.target_job_title}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UploadResumeButton />
            <ExportMenu resumeId={resume.id} />
          </div>
        </div>

        {/* Job description tailor */}
        <div className="mb-6">
          <JobDescriptionInput resumeId={resume.id} />
        </div>

        {/* Editor sections */}
        <ResumeEditor resume={activeResume || resume} />
      </main>
    </div>
  )
}
