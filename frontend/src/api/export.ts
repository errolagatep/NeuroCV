import { apiClient } from './client'
import type { TemplateId } from '../types/resume'

export async function exportResume(resumeId: string, format: 'pdf' | 'docx', template?: TemplateId): Promise<void> {
  const response = await apiClient.post(
    `/export/${format}`,
    { resume_id: resumeId, ...(template ? { template } : {}) },
    { responseType: 'blob' }
  )
  const url = URL.createObjectURL(response.data)
  const a = document.createElement('a')
  a.href = url
  a.download = `resume.${format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
