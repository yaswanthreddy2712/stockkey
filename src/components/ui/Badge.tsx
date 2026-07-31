import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'green' | 'red' | 'blue' | 'amber' | 'slate' | 'teal' | 'purple'
  className?: string
}

const colorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-gold-50 text-gold-700',
  amber: 'bg-amber-50 text-amber-700',
  slate: 'bg-ink-50 text-ink-600',
  teal: 'bg-teal-50 text-teal-700',
  purple: 'bg-violet-50 text-violet-700',
}

export default function Badge({ children, color = 'slate', className = '' }: BadgeProps) {
  return <span className={`badge ${colorClasses[color]} ${className}`}>{children}</span>
}

export const statusColor = (status: string): BadgeProps['color'] => {
  switch (status) {
    case 'Active': case 'Closed': return 'green'
    case 'Pending': case 'New': return 'amber'
    case 'Inactive': case 'Lost': return 'red'
    case 'Contacted': return 'blue'
    case 'In Progress': return 'purple'
    default: return 'slate'
  }
}
