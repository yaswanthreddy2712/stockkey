import { useState, useMemo } from 'react'
import DashboardShell from '../../components/DashboardShell'
import { useData } from '../../context/DataContext'
import Badge, { statusColor } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { inr, formatDateTime, timeAgo } from '../../lib/utils'
import { IconEdit, IconTrash, IconShield, IconBriefcase, IconMail } from '../../components/icons'
import type { Lead, LeadType, LeadStatus } from '../../types'

const statuses: LeadStatus[] = ['New', 'Contacted', 'In Progress', 'Closed', 'Lost']

interface Props {
  type: LeadType
}

export default function AdminLeads({ type }: Props) {
  const { leads, updateLead, deleteLead } = useData()
  const [statusFilter, setStatusFilter] = useState('All')
  const [editing, setEditing] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')

  const filtered = useMemo(() => leads
    .filter((l) => l.type === type)
    .filter((l) => statusFilter === 'All' || l.status === statusFilter)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
  [leads, type, statusFilter])

  const title = type === 'Insurance' ? 'Insurance Leads' : type === 'Investment' ? 'Investment Leads' : 'Messages'
  const Icon = type === 'Insurance' ? IconShield : type === 'Investment' ? IconBriefcase : IconMail

  const openEdit = (l: Lead) => { setEditing(l); setNotes(l.notes ?? '') }
  const saveEdit = () => {
    if (editing) updateLead(editing.id, { notes })
    setEditing(null)
  }
  const quickStatus = (id: string, status: LeadStatus) => updateLead(id, { status })
  const handleDelete = (id: string) => { if (confirm('Delete this lead?')) deleteLead(id) }

  return (
    <DashboardShell variant="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 font-display">{title}</h1>
        <p className="text-ink-500 text-sm">{filtered.length} {type.toLowerCase()} enquiries from the website.</p>
      </div>

      {/* Status filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['All', ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              statusFilter === s
                ? 'bg-gold-500 text-ink-900'
                : 'bg-white text-ink-600 border border-ink-200 hover:border-gold-500/30'
            }`}
          >
            {s} {s !== 'All' && <span className="opacity-70">({leads.filter((l) => l.type === type && l.status === s).length})</span>}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        {filtered.map((l) => (
          <div key={l.id} className="premium-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-50 text-gold-600 text-sm font-bold">{l.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-ink-800">{l.name}</p>
                  <p className="text-xs text-ink-400">{l.email} &middot; {l.phone}</p>
                  <p className="text-xs text-ink-400 mt-0.5">Received {timeAgo(l.createdAt)} &middot; {formatDateTime(l.createdAt)}</p>
                </div>
              </div>
              <Badge color={statusColor(l.status)}>{l.status}</Badge>
            </div>

            {/* Lead specifics */}
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              {type === 'Investment' && (
                <>
                  <div><span className="text-ink-400">Plan:</span> <span className="font-medium text-ink-800">{l.plan}</span></div>
                  <div><span className="text-ink-400">Amount:</span> <span className="font-medium tabular">{l.investmentAmount ? inr(l.investmentAmount, true) : '—'}</span></div>
                  <div><span className="text-ink-400">Aadhaar:</span> <span className="font-medium">{l.aadhaar || '—'}</span></div>
                </>
              )}
              {type === 'Insurance' && (
                <>
                  <div><span className="text-ink-400">Category:</span> <span className="font-medium text-ink-800">{l.insuranceCategory}</span></div>
                  <div><span className="text-ink-400">Est. Premium:</span> <span className="font-medium tabular">{l.estimatedPremium ? inr(l.estimatedPremium) : '—'}</span></div>
                </>
              )}
              {type === 'Contact' && (
                <div className="lg:col-span-4"><span className="text-ink-400">Message:</span> <span className="text-ink-700">{l.message}</span></div>
              )}
            </div>

            {l.notes && (
              <div className="mt-3 rounded-xl bg-gold-50 px-3 py-2 text-sm text-gold-800">
                <strong>Notes:</strong> {l.notes}
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink-50 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-400">Update status:</span>
                <select
                  value={l.status}
                  onChange={(e) => quickStatus(l.id, e.target.value as LeadStatus)}
                  className="rounded-md border border-ink-200 px-2 py-1 text-sm focus:border-gold-500 focus:outline-none"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(l)} className="rounded-md p-1.5 text-ink-400 hover:bg-gold-50 hover:text-gold-600 transition-colors" title="Add note"><IconEdit className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(l.id)} className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><IconTrash className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="premium-card p-12 text-center text-ink-400">
            <Icon className="mx-auto h-10 w-10 mb-2" />
            No {type.toLowerCase()} leads found.
          </div>
        )}
      </div>

      {/* Notes modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Lead Notes">
        {editing && (
          <div className="space-y-4">
            <div className="text-sm text-ink-600">
              <p><strong className="text-ink-800">{editing.name}</strong> &mdash; {editing.email}</p>
            </div>
            <div>
              <label className="label">Internal notes</label>
              <textarea className="input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add follow-up notes..." />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
              <button onClick={saveEdit} className="btn-gold">Save Notes</button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  )
}
