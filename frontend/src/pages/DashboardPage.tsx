import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getResumes, createResume, deleteResume } from '../api/resumes'
import { Navbar } from '../components/layout/Navbar'
import { ResumeCard } from '../components/dashboard/ResumeCard'
import { NewResumeModal } from '../components/dashboard/NewResumeModal'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { toast } from '../components/ui/Toast'

export function DashboardPage() {
  const [showModal, setShowModal] = useState(false)
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  })

  const createMutation = useMutation({
    mutationFn: createResume,
    onSuccess: (resume) => {
      qc.invalidateQueries({ queryKey: ['resumes'] })
      setShowModal(false)
      toast('success', 'Resume created!')
      navigate(`/editor/${resume.id}`)
    },
    onError: () => toast('error', 'Failed to create resume'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resumes'] })
      toast('success', 'Resume deleted')
    },
    onError: () => toast('error', 'Failed to delete resume'),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage your NeuroCV resumes</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            New Resume
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No resumes yet.</p>
            <p className="text-gray-400 text-sm mt-1">Click "New Resume" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>

      <NewResumeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => createMutation.mutateAsync(data)}
      />
    </div>
  )
}
