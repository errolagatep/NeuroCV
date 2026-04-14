import { useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAISuggest } from '../../hooks/useAISuggest'
import { AISuggestionPanel } from './AISuggestionPanel'
import { useResumeStore } from '../../store/resumeStore'
import { clsx } from 'clsx'

interface Props {
  sectionId: string
  sectionType: string
  title: string
  currentContent: unknown
  showAI?: boolean
  children: React.ReactNode
}

export function SectionWrapper({ sectionId, sectionType, title, currentContent, showAI = true, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const { suggest, loadingSectionId } = useAISuggest()
  const { aiSuggestions, activeSuggestionSectionId } = useResumeStore()

  const isLoading = loadingSectionId === sectionId
  const suggestions = aiSuggestions[sectionId] || []
  const showPanel = activeSuggestionSectionId === sectionId && suggestions.length > 0

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer select-none"
        onClick={() => setCollapsed((c) => !c)}
      >
        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-2">
          {showAI && (
            <Button
              variant="ghost"
              size="sm"
              loading={isLoading}
              className="text-indigo-600 hover:bg-indigo-50"
              onClick={(e) => { e.stopPropagation(); suggest(sectionId, sectionType, currentContent) }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Suggest
            </Button>
          )}
          {collapsed ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronUp className="h-4 w-4 text-gray-400" />}
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className={clsx('flex', showPanel ? 'divide-x divide-gray-100' : '')}>
          <div className="flex-1 p-5">{children}</div>
          {showPanel && (
            <div className="w-80 shrink-0">
              <AISuggestionPanel sectionId={sectionId} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
