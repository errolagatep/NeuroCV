import type { TemplateId } from '../types/resume'

export interface TemplateDefinition {
  id: TemplateId
  name: string
  description: string
  suitableFor: string
  accentClass: string   // Tailwind bg class for top accent bar
  preview: string       // ASCII mockup
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional serif layout in black & white. Timeless and formal.',
    suitableFor: 'Finance · Law · Government',
    accentClass: 'bg-gray-900',
    preview: `       JANE DOE
  jane@email.com · 555-0100
 ───────────────────────────
 EXPERIENCE
   Senior Analyst — Acme Co
   2020–Present
   • Led cross-functional team
   • Reduced costs by 18%
 EDUCATION
   MBA — Harvard Business School`,
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean sans-serif with a bold indigo accent. Crisp and contemporary.',
    suitableFor: 'Tech · Startups · Product',
    accentClass: 'bg-indigo-600',
    preview: `        Jane Doe
  jane@email.com · 555-0100
 ══════════════════════════
 EXPERIENCE
   Product Manager · Acme
   2021–Present
   › Launched 3 core features
   › Grew DAU by 40%
 SKILLS
   React · Python · Figma`,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold dark header with white name. Projects seniority and authority.',
    suitableFor: 'Director · VP · C-Suite',
    accentClass: 'bg-slate-800',
    preview: `╔══════════════════════════╗
║       JANE DOE           ║
║  Chief Product Officer   ║
╚══════════════════════════╝
 EXPERIENCE
   CPO — Acme Corp
   2018–Present
   • Scaled product to 5M users
   • Managed $20M P&L
 BOARD & ADVISORY
   Techstars · Forbes 50`,
  },
  {
    id: 'compact',
    name: 'Compact Technical',
    description: 'Two-column layout with skills sidebar. Maximises content density.',
    suitableFor: 'Engineers · Data Science',
    accentClass: 'bg-slate-500',
    preview: `┌──────────┬─────────────────┐
│ SKILLS   │ Jane Doe        │
│ Python   │ Software Engineer│
│ React    │─────────────────│
│ Docker   │ EXPERIENCE      │
│──────────│ Sr. Eng · Acme  │
│ CONTACT  │ 2020–Present    │
│ GitHub   │ • Built ML pipe │
│ LinkedIn │ • 99.9% uptime  │
└──────────┴─────────────────┘`,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined spacing with decorative thin lines. Polished and distinguished.',
    suitableFor: 'Consulting · Marketing',
    accentClass: 'bg-blue-900',
    preview: `
        J A N E   D O E
      ── ── ── ── ── ── ──
   jane@email.com · New York

   E X P E R I E N C E

   Principal Consultant
   McKinsey & Company
   · Advised Fortune 500 CEOs
   · Led digital transformation

   ── ── ── ── ── ── ──`,
  },
]
