import { apiClient } from './client'

export async function exportResume(resumeId: string, format: 'pdf' | 'docx'): Promise<void> {
  const response = await apiClient.post(
    `/export/${format}`,
    { resume_id: resumeId },
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
