import { useState } from 'react'
import { Download } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TemplateSelector } from '../dashboard/TemplateSelector'
import { exportResume } from '../../api/export'
import { toast } from '../ui/Toast'
import type { TemplateId } from '../../types/resume'

interface Props {
  open: boolean
  onClose: () => void
  resumeId: string
  currentTemplate: TemplateId
}

export function ExportModal({ open, onClose, resumeId, currentTemplate }: Props) {
  const [template, setTemplate] = useState<TemplateId>(currentTemplate)
  const [loading, setLoading] = useState<'pdf' | 'docx' | null>(null)

  const handleExport = async (format: 'pdf' | 'docx') => {
    setLoading(format)
    try {
      await exportResume(resumeId, format, template)
      toast('success', `Downloaded ${format.toUpperCase()}`)
      onClose()
    } catch {
      toast('error', `Failed to export ${format.toUpperCase()}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Export Resume" size="xl">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-gray-500 mb-3">Choose a template for your exported resume:</p>
          <TemplateSelector value={template} onChange={setTemplate} />
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Select format to download:</p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={loading === 'pdf'}
              disabled={loading === 'docx'}
              onClick={() => handleExport('pdf')}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button
              size="sm"
              loading={loading === 'docx'}
              disabled={loading === 'pdf'}
              onClick={() => handleExport('docx')}
            >
              <Download className="h-4 w-4" />
              Word
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
