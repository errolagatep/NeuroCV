import { apiClient } from './client'
import type { ParsedResume } from '../types/resume'

export async function parseUploadedResume(file: File): Promise<{ parsed: ParsedResume }> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/upload/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
