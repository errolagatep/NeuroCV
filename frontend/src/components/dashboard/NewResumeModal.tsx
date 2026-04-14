import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { TemplateSelector } from './TemplateSelector'
import type { TemplateId } from '../../types/resume'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  target_job_title: z.string().optional(),
  template: z.enum(['classic', 'modern', 'executive', 'compact', 'elegant']),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => Promise<unknown>
}

export function NewResumeModal({ open, onClose, onSubmit }: Props) {
  const [step, setStep] = useState<1 | 2>(1)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { template: 'modern' },
  })

  const selectedTemplate = watch('template') as TemplateId

  const handleClose = () => {
    reset({ template: 'modern' })
    setStep(1)
    onClose()
  }

  const submit = async (data: FormData) => {
    await onSubmit(data)
    reset({ template: 'modern' })
    setStep(1)
  }

  const stepTitles = {
    1: 'New Resume — Details',
    2: 'New Resume — Choose Template',
  }

  return (
    <Modal open={open} onClose={handleClose} title={stepTitles[step]} size={step === 2 ? 'xl' : 'md'}>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-5">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 w-2 rounded-full transition-colors ${s === step ? 'bg-indigo-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(submit)}>
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Resume title"
              placeholder="e.g. Google SWE 2025"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Target job title (optional)"
              placeholder="e.g. Software Engineer"
              {...register('target_job_title')}
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button type="button" onClick={() => setStep(2)}>Next →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <TemplateSelector
              value={selectedTemplate}
              onChange={(id) => setValue('template', id)}
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>← Back</Button>
              <Button type="submit" loading={isSubmitting}>Create Resume</Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
