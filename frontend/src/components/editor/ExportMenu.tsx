import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { exportResume } from '../../api/export'
import { toast } from '../ui/Toast'

interface Props { resumeId: string }

export function ExportMenu({ resumeId }: Props) {
  const [loading, setLoading] = useState<'pdf' | 'docx' | null>(null)

  const handleExport = async (format: 'pdf' | 'docx') => {
    setLoading(format)
    try {
      await exportResume(resumeId, format)
      toast('success', `Downloaded ${format.toUpperCase()}`)
    } catch {
      toast('error', `Failed to export ${format.toUpperCase()}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        loading={loading === 'pdf'}
        onClick={() => handleExport('pdf')}
      >
        <Download className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="secondary"
        size="sm"
        loading={loading === 'docx'}
        onClick={() => handleExport('docx')}
      >
        <Download className="h-4 w-4" />
        Word
      </Button>
    </div>
  )
}
