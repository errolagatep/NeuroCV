import { Check, X } from 'lucide-react'
import { useResumeStore } from '../../store/resumeStore'

interface Props {
  sectionId: string
  onAccept?: (suggestion: string) => void
}

export function AISuggestionPanel({ sectionId, onAccept }: Props) {
  const { aiSuggestions, clearAISuggestions, setActiveSuggestionSectionId } = useResumeStore()
  const suggestions = aiSuggestions[sectionId] || []

  const close = () => {
    clearAISuggestions(sectionId)
    setActiveSuggestionSectionId(null)
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">AI Suggestions</p>
        <button onClick={close} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="group relative border border-gray-100 rounded-lg p-3 text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
            onClick={() => onAccept?.(s)}
          >
            <p className="pr-6">{s}</p>
            {onAccept && (
              <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-indigo-500">
                <Check className="h-4 w-4" />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">Click a suggestion to apply it</p>
    </div>
  )
}
