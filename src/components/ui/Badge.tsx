import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'green' | 'red' | 'blue' | 'amber' | 'slate' | 'teal' | 'purple'
  className?: string
}

const colorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-600',
  teal: 'bg-teal-100 text-teal-700',
  purple: 'bg-purple-100 text-purple-700',
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
