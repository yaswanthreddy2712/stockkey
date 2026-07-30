import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: ReactNode
  hint?: string
  accent?: 'blue' | 'teal' | 'amber' | 'green' | 'purple'
}

const accents = {
  blue: 'bg-blue-50 text-blue-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
}

export default function StatCard({ label, value, icon, hint, accent = 'blue' }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className={`rounded-xl p-3 ${accents[accent]}`}>{icon}</div>
      </div>
    </div>
  )
}
