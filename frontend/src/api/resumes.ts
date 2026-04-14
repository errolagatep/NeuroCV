import { apiClient } from './client'
import type { Resume, ResumeWithSections } from '../types/resume'

export async function getResumes(): Promise<Resume[]> {
  const { data } = await apiClient.get('/resumes')
  return data
}

export async function getResume(id: string): Promise<ResumeWithSections> {
  const { data } = await apiClient.get(`/resumes/${id}`)
  return data
}

export async function createResume(payload: { title: string; target_job_title?: string }): Promise<Resume> {
  const { data } = await apiClient.post('/resumes', payload)
  return data
}

export async function updateResume(
  id: string,
  payload: { title?: string; target_job_title?: string; job_description?: string }
): Promise<Resume> {
  const { data } = await apiClient.patch(`/resumes/${id}`, payload)
  return data
}

export async function deleteResume(id: string): Promise<void> {
  await apiClient.delete(`/resumes/${id}`)
}
