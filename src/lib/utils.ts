// Formatting + misc helpers

export const inr = (n: number, compact = false): string => {
  if (compact) {
    if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
    if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)} L`
    if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export const inrSigned = (n: number): string => {
  const sign = n >= 0 ? '+' : '-'
  return `${sign}${inr(Math.abs(n))}`
}

export const pct = (n: number): string => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return `${Math.floor(months / 12)} year(s) ago`
}

export const newId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

// Portfolio math
export const holdingValue = (qty: number, price: number): number => qty * price

export const holdingPnl = (qty: number, avg: number, current: number): number =>
  qty * (current - avg)

export const holdingPnlPct = (avg: number, current: number): number =>
  avg === 0 ? 0 : ((current - avg) / avg) * 100
