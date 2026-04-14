import { apiClient } from './client'
import type { ResumeSection } from '../types/resume'

export async function updateSection(id: string, content: unknown): Promise<ResumeSection> {
  const { data } = await apiClient.patch(`/sections/${id}`, { content })
  return data
}
