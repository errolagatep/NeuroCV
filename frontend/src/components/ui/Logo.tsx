import { useState } from 'react'
import { BrainCircuit } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizes = {
  sm: { img: 'h-7 w-7', icon: 'h-5 w-5', text: 'text-lg' },
  md: { img: 'h-9 w-9', icon: 'h-7 w-7', text: 'text-xl' },
  lg: { img: 'h-14 w-14', icon: 'h-10 w-10', text: 'text-3xl' },
}

/**
 * Drop your logo file at:
 *   frontend/public/logo/neurocv-logo.png
 *
 * It will automatically appear here. Until then, the fallback icon shows.
 */
export function Logo({ size = 'md', showText = true }: LogoProps) {
  const [srcIndex, setSrcIndex] = useState(0)
  const [imgFailed, setImgFailed] = useState(false)
  const s = sizes[size]

  const candidates = [
    '/logo/neurocv-logo.jpg',
    '/logo/neurocv-logo.jpeg',
    '/logo/neurocv-logo.png',
    '/logo/neurocv-logo.webp',
  ]

  const tryNext = () => {
    if (srcIndex + 1 < candidates.length) {
      setSrcIndex((i) => i + 1)
    } else {
      setImgFailed(true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!imgFailed ? (
        <img
          src={candidates[srcIndex]}
          alt="NeuroCV logo"
          className={`${s.img} object-contain`}
          onError={tryNext}
        />
      ) : (
        <div className="bg-indigo-100 text-indigo-600 rounded-xl p-1.5 flex items-center justify-center">
          <BrainCircuit className={s.icon} />
        </div>
      )}
      {showText && (
        <span className={`font-bold text-gray-900 tracking-tight ${s.text}`}>
          Neuro<span className="text-indigo-600">CV</span>
        </span>
      )}
    </div>
  )
}
