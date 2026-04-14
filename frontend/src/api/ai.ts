import { apiClient } from './client'

export async function suggestForSection(payload: {
  section_id: string
  section_type: string
  current_content: unknown
  context?: Record<string, string>
}): Promise<{ suggestions: string[] }> {
  const { data } = await apiClient.post('/ai/suggest', payload)
  return data
}

export async function tailorToJob(payload: {
  resume_id: string
  job_description: string
}): Promise<{ tailored_sections: { section_id: string; section_type: string; suggestion: string }[] }> {
  const { data } = await apiClient.post('/ai/tailor', payload)
  return data
}
