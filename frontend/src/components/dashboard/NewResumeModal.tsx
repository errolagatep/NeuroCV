import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  target_job_title: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => Promise<unknown>
}

export function NewResumeModal({ open, onClose, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const submit = async (data: FormData) => {
    await onSubmit(data)
    reset()
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Resume">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
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
          <Button type="submit" loading={isSubmitting}>Create</Button>
        </div>
      </form>
    </Modal>
  )
}
