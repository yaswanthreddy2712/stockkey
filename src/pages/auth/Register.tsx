import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IconChart, IconCheck } from '../../components/icons'
import type { InvestmentPlanTier } from '../../types'

const plans: { tier: InvestmentPlanTier; investment: number; payout: number }[] = [
  { tier: 'Premium', investment: 1000000, payout: 40000 },
  { tier: 'Standard', investment: 500000, payout: 20000 },
  { tier: 'Customised', investment: 100000, payout: 0 },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', aadhaar: '', password: '', confirm: '',
    plan: 'Standard' as InvestmentPlanTier,
  })

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const res = await register({
      name: form.name, email: form.email, password: form.password,
      phone: form.phone, aadhaar: form.aadhaar, plan: form.plan,
    })
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Registration failed'); return }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-accent-600 to-brand-800 text-white p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><IconChart className="h-5 w-5" /></span>
          <span className="font-bold">Stock Key Investments</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Start your journey to early retirement.</h2>
          <ul className="mt-6 space-y-3">
            {['Guaranteed monthly payouts','Diversified, professionally managed portfolio','Transparent performance reports','Insurance for health, term, car & bike'].map((t) => (
              <li key={t} className="flex items-center gap-2"><IconCheck className="h-5 w-5 text-accent-300" /> {t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-brand-100">SEBI Registered · NISM-Certified Experts</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Open an account and choose your investment plan.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div><label className="label">Full Name *</label><input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Email *</label><input className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" /></div>
              <div><label className="label">Mobile *</label><input className="input" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 ..." /></div>
            </div>
            <div><label className="label">Aadhaar Number *</label><input className="input" required value={form.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} placeholder="XXXX-XXXX-1234" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Password *</label><input className="input" type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 6 characters" /></div>
              <div><label className="label">Confirm *</label><input className="input" type="password" required value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Re-enter" /></div>
            </div>
            <div>
              <label className="label">Choose Investment Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((p) => (
                  <button type="button" key={p.tier} onClick={() => set('plan', p.tier)}
                    className={`rounded-lg border p-3 text-left text-sm transition ${form.plan === p.tier ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className="block font-semibold text-slate-800">{p.tier}</span>
                    <span className="block text-xs text-slate-500">₹{p.investment >= 100000 ? `${p.investment / 100000}L` : p.investment}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-base">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">Already have an account? <Link to="/login" className="font-medium text-brand-600">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
