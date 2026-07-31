import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: ReactNode
  hint?: string
  accent?: 'blue' | 'teal' | 'amber' | 'green' | 'purple'
}

const accents = {
  blue: 'bg-gold-50 text-gold-600',
  teal: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-violet-50 text-violet-600',
}

export default function StatCard({ label, value, icon, hint, accent = 'blue' }: StatCardProps) {
  return (
    <div className="premium-card gold-accent-top p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink-900 tabular">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
        </div>
        <div className={`rounded-xl p-3 ${accents[accent]}`}>{icon}</div>
      </div>
    </div>
  )
}
