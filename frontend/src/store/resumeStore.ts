import { create } from 'zustand'
import type { ResumeWithSections } from '../types/resume'

interface ResumeState {
  activeResume: ResumeWithSections | null
  aiSuggestions: Record<string, string[]>  // sectionId -> suggestions
  activeSuggestionSectionId: string | null
  setActiveResume: (resume: ResumeWithSections | null) => void
  updateSectionLocal: (sectionId: string, content: unknown) => void
  setAISuggestions: (sectionId: string, suggestions: string[]) => void
  clearAISuggestions: (sectionId: string) => void
  setActiveSuggestionSectionId: (id: string | null) => void
}

export const useResumeStore = create<ResumeState>((set) => ({
  activeResume: null,
  aiSuggestions: {},
  activeSuggestionSectionId: null,

  setActiveResume: (resume) => set({ activeResume: resume }),

  updateSectionLocal: (sectionId, content) =>
    set((state) => {
      if (!state.activeResume) return state
      return {
        activeResume: {
          ...state.activeResume,
          sections: state.activeResume.sections.map((s) =>
            s.id === sectionId ? { ...s, content } : s
          ),
        },
      }
    }),

  setAISuggestions: (sectionId, suggestions) =>
    set((state) => ({
      aiSuggestions: { ...state.aiSuggestions, [sectionId]: suggestions },
    })),

  clearAISuggestions: (sectionId) =>
    set((state) => {
      const next = { ...state.aiSuggestions }
      delete next[sectionId]
      return { aiSuggestions: next }
    }),

  setActiveSuggestionSectionId: (id) => set({ activeSuggestionSectionId: id }),
}))
