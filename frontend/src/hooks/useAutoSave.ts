import { useEffect, useRef } from 'react'
import { updateSection } from '../api/sections'
import { useResumeStore } from '../store/resumeStore'
import { toast } from '../components/ui/Toast'

export function useAutoSave(sectionId: string, content: unknown, delay = 1500) {
  const { updateSectionLocal } = useResumeStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevRef = useRef<string>(JSON.stringify(content))

  useEffect(() => {
    const serialized = JSON.stringify(content)
    if (serialized === prevRef.current) return
    prevRef.current = serialized

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        await updateSection(sectionId, content)
        updateSectionLocal(sectionId, content)
      } catch {
        toast('error', 'Failed to save section')
      }
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [content, sectionId, delay])
}
