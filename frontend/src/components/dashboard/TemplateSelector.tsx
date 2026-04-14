import { clsx } from 'clsx'
import { TEMPLATES } from '../../lib/templates'
import type { TemplateId } from '../../types/resume'

interface Props {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplateSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATES.map((t) => {
        const selected = value === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={clsx(
              'text-left rounded-xl border-2 overflow-hidden transition-all focus:outline-none',
              selected
                ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            )}
          >
            {/* Accent bar */}
            <div className={`h-1.5 w-full ${t.accentClass}`} />

            <div className="p-3 flex flex-col gap-1.5">
              {/* Name + check */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-900 leading-tight">{t.name}</span>
                {selected && (
                  <span className="text-indigo-600 text-xs font-bold">✓</span>
                )}
              </div>

              {/* ASCII preview */}
              <pre className="text-[6.5px] leading-tight text-gray-400 font-mono bg-gray-50 rounded p-1.5 overflow-hidden whitespace-pre h-[72px]">
                {t.preview}
              </pre>

              {/* Description */}
              <p className="text-[10px] text-gray-500 leading-tight">{t.description}</p>

              {/* Suitable for badge */}
              <span className="text-[9px] text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5 self-start font-medium leading-tight">
                {t.suitableFor}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
