import { useState, useMemo, useRef } from 'react'
import DashboardShell from '../../components/DashboardShell'
import { useData } from '../../context/DataContext'
import Badge, { statusColor } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import InvestmentCertificate from '../../components/InvestmentCertificate'
import { inr, formatDate, holdingValue } from '../../lib/utils'
import { IconEdit, IconTrash, IconCheck, IconDownload } from '../../components/icons'
import type { Customer, InvestmentPlanTier } from '../../types'

const emptyCustomer = (): Omit<Customer, 'id'> => ({
  name: '', email: '', phone: '', aadhaar: '', pan: '', plan: 'Standard',
  investedAmount: 500000, monthlyPayout: 60000, joinDate: new Date().toISOString(),
  status: 'Pending', kycVerified: false, address: '', dateOfBirth: '', photo: '', holdings: [], transactions: [],
})

const planDefaults: Record<InvestmentPlanTier, { invested: number; payout: number }> = {
  Premium: { invested: 1000000, payout: 120000 },
  Standard: { invested: 500000, payout: 60000 },
  Customised: { invested: 100000, payout: 12000 },
}

export default function AdminCustomers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Customer, 'id'>>(emptyCustomer())
  const [viewing, setViewing] = useState<Customer | null>(null)
  const [certCustomer, setCertCustomer] = useState<Customer | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => customers.filter((c) => {
    const matchesSearch = (c.name + c.email + c.phone).toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter
    return matchesSearch && matchesStatus
  }), [customers, search, statusFilter])

  const openAdd = () => { setEditingId(null); setForm(emptyCustomer()); setModalOpen(true) }
  const openEdit = (c: Customer) => {
    setEditingId(c.id)
    const { id, ...rest } = c
    void id
    setForm(rest)
    setModalOpen(true)
  }

  const onPlanChange = (plan: InvestmentPlanTier) => {
    const d = planDefaults[plan]
    setForm((f) => ({ ...f, plan, investedAmount: d.invested, monthlyPayout: d.payout }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateCustomer(editingId, form)
    } else {
      addCustomer(form)
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer? This cannot be undone.')) deleteCustomer(id)
  }

  const set = <K extends keyof Omit<Customer, 'id'>>(k: K, v: Omit<Customer, 'id'>[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <DashboardShell variant="admin">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 font-display">Customers</h1>
          <p className="text-ink-500 text-sm">{customers.length} total &middot; manage all customer accounts</p>
        </div>
        <button onClick={openAdd} className="btn-gold">+ Add Customer</button>
      </div>

      {/* Filters */}
      <div className="premium-card p-4 mb-4 flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-[180px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {['All', 'Active', 'Pending', 'Inactive'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50">
              <tr className="text-left text-ink-500">
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">Plan</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">Invested</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">Holdings</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">KYC</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((c) => {
                const holdingsValue = c.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
                return (
                  <tr key={c.id} className="hover:bg-gold-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => setViewing(c)} className="text-left">
                        <span className="font-semibold text-ink-800 hover:text-gold-600 transition-colors">{c.name}</span>
                        <br /><span className="text-xs text-ink-400">{c.email}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3"><Badge color="blue">{c.plan}</Badge></td>
                    <td className="px-4 py-3 font-medium tabular">{inr(c.investedAmount, true)}</td>
                    <td className="px-4 py-3 tabular">{holdingsValue ? inr(holdingsValue, true) : <span className="text-ink-400">&mdash;</span>}</td>
                    <td className="px-4 py-3">{c.kycVerified ? <IconCheck className="h-4 w-4 text-emerald-600" /> : <span className="text-amber-500">Pending</span>}</td>
                    <td className="px-4 py-3"><Badge color={statusColor(c.status)}>{c.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-ink-400 hover:bg-gold-50 hover:text-gold-600 transition-colors" title="Edit"><IconEdit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><IconTrash className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Customer' : 'Add Customer'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex items-center gap-4">
              {form.photo ? (
                <img src={form.photo} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-ink-200" />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-ink-50 border border-ink-200 flex items-center justify-center text-xl font-bold text-ink-300">{form.name.charAt(0) || '?'}</div>
              )}
              <div>
                <button type="button" onClick={() => photoRef.current?.click()} className="btn-outline text-xs">Upload Photo</button>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <p className="text-[10px] text-ink-400 mt-1">Required for certificate</p>
              </div>
            </div>
            <div><label className="label">Full Name *</label><input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label className="label">Email *</label><input className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label className="label">Phone *</label><input className="input" required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            <div><label className="label">Date of Birth</label><input className="input" type="date" value={form.dateOfBirth.slice(0, 10)} onChange={(e) => set('dateOfBirth', e.target.value)} /></div>
            <div><label className="label">Aadhaar Number *</label><input className="input" required value={form.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} placeholder="XXXX-XXXX-1234" /></div>
            <div><label className="label">PAN Number *</label><input className="input" required value={form.pan} onChange={(e) => set('pan', e.target.value)} placeholder="ABCDE1234F" /></div>
            <div>
              <label className="label">Plan</label>
              <select className="input" value={form.plan} onChange={(e) => onPlanChange(e.target.value as InvestmentPlanTier)}>
                {(['Premium', 'Standard', 'Customised'] as InvestmentPlanTier[]).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value as Customer['status'])}>
                {['Active', 'Pending', 'Inactive'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="label">Invested Amount (₹)</label><input className="input" type="number" value={form.investedAmount} onChange={(e) => set('investedAmount', Number(e.target.value))} /></div>
            <div><label className="label">Monthly Payout (₹)</label><input className="input" type="number" value={form.monthlyPayout} onChange={(e) => set('monthlyPayout', Number(e.target.value))} /></div>
            <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input id="kyc" type="checkbox" checked={form.kycVerified} onChange={(e) => set('kycVerified', e.target.checked)} className="h-4 w-4 rounded accent-gold-500" />
              <label htmlFor="kyc" className="text-sm text-ink-700">KYC Verified</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-gold">{editingId ? 'Save Changes' : 'Add Customer'}</button>
          </div>
        </form>
      </Modal>

      {/* View customer modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Customer Details" size="md">
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-ink-100">
              {viewing.photo ? (
                <img src={viewing.photo} alt={viewing.name} className="h-12 w-12 rounded-full object-cover border border-ink-200" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-50 text-gold-600 text-lg font-bold">{viewing.name.charAt(0)}</div>
              )}
              <div>
                <p className="font-bold text-ink-800">{viewing.name}</p>
                <p className="text-ink-500">{viewing.email} &middot; {viewing.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-ink-400">Plan</p><p className="font-medium">{viewing.plan}</p></div>
              <div><p className="text-xs text-ink-400">Status</p><p><Badge color={statusColor(viewing.status)}>{viewing.status}</Badge></p></div>
              <div><p className="text-xs text-ink-400">Invested</p><p className="font-medium tabular">{inr(viewing.investedAmount)}</p></div>
              <div><p className="text-xs text-ink-400">Monthly Payout</p><p className="font-medium tabular">{inr(viewing.monthlyPayout)}</p></div>
              <div><p className="text-xs text-ink-400">Aadhaar</p><p className="font-medium">{viewing.aadhaar || '—'}</p></div>
              <div><p className="text-xs text-ink-400">PAN</p><p className="font-medium">{viewing.pan || '—'}</p></div>
              <div><p className="text-xs text-ink-400">Joined</p><p className="font-medium">{formatDate(viewing.joinDate)}</p></div>
              <div><p className="text-xs text-ink-400">KYC</p><p>{viewing.kycVerified ? <Badge color="green">Verified</Badge> : <Badge color="amber">Pending</Badge>}</p></div>
              <div className="col-span-2"><p className="text-xs text-ink-400">Address</p><p className="font-medium">{viewing.address || '—'}</p></div>
            </div>
            {viewing.holdings.length > 0 && (
              <div className="pt-3 border-t border-ink-100">
                <p className="text-xs text-ink-400 mb-2">Holdings ({viewing.holdings.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewing.holdings.map((h) => <span key={h.id} className="badge bg-ink-50 text-ink-600">{h.symbol} &middot; {h.quantity}</span>)}
                </div>
              </div>
            )}
            <div className="pt-3 border-t border-ink-100">
              <button onClick={() => { setCertCustomer(viewing); setViewing(null) }} className="btn-gold text-sm w-full flex items-center justify-center gap-2">
                <IconDownload className="h-4 w-4" /> Generate Investment Certificate
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Certificate modal */}
      <Modal open={!!certCustomer} onClose={() => setCertCustomer(null)} title="Investment Certificate" size="xl">
        {certCustomer && <InvestmentCertificate customer={certCustomer} />}
      </Modal>
    </DashboardShell>
  )
}
