import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { ExportModal } from './ExportModal'
import type { TemplateId } from '../../types/resume'

interface Props {
  resumeId: string
  currentTemplate: TemplateId
}

export function ExportMenu({ resumeId, currentTemplate }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Download className="h-4 w-4" />
        Export
      </Button>

      <ExportModal
        open={open}
        onClose={() => setOpen(false)}
        resumeId={resumeId}
        currentTemplate={currentTemplate}
      />
    </>
  )
}
