import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IconChart, IconCheck } from '../../components/icons'
import type { InvestmentPlanTier } from '../../types'

const plans: { tier: InvestmentPlanTier; investment: number; payout: number }[] = [
  { tier: 'Premium', investment: 1000000, payout: 120000 },
  { tier: 'Standard', investment: 500000, payout: 60000 },
  { tier: 'Customised', investment: 100000, payout: 12000 },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', aadhaar: '', pan: '', password: '', confirm: '',
    plan: 'Standard' as InvestmentPlanTier, photo: '',
  })
  const photoRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('photo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.photo) { setError('Photo is mandatory — please upload your photo.'); return }
    if (!form.aadhaar) { setError('Aadhaar number is mandatory.'); return }
    if (!form.pan) { setError('PAN number is mandatory.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const res = await register({
      name: form.name, email: form.email, password: form.password,
      phone: form.phone, aadhaar: form.aadhaar, pan: form.pan, plan: form.plan,
    })
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Registration failed'); return }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="bg-ink-900 relative overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-32 left-0 h-72 w-72 rounded-full bg-gold-500/5 blur-[100px]" />
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-500/15">
            <IconChart className="h-5 w-5 text-gold-500" />
          </span>
          <span className="font-bold text-white">Stock Key Investments</span>
        </Link>
        <div className="relative z-10 animate-fade-up">
          <h2 className="text-3xl font-display font-bold leading-tight text-white">
            Start your journey to early retirement.
          </h2>
          <ul className="mt-6 space-y-3">
            {['12% monthly returns', 'Diversified, professionally managed portfolio', 'Transparent performance reports', 'Insurance for health, term, car & bike'].map((t) => (
              <li key={t} className="flex items-center gap-2 text-ink-300">
                <IconCheck className="h-5 w-5 text-gold-400 flex-shrink-0" />{t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10">
          <span className="badge-gold text-xs">SEBI Registered &middot; NISM-Certified Experts</span>
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex items-center justify-center p-6 sm:p-10 overflow-y-auto bg-[#F7F8FB]">
        <div className="w-full max-w-md py-6 animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-ink-400">Open an account and choose your investment plan.</p>

          {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Photo upload */}
            <div className="flex items-center gap-4">
              {form.photo ? (
                <img src={form.photo} alt="Preview" className="h-16 w-16 rounded-xl object-cover border-2 border-gold-400" />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-red-50 border-2 border-dashed border-red-300 flex items-center justify-center text-xl font-bold text-red-300">?</div>
              )}
              <div>
                <button type="button" onClick={() => photoRef.current?.click()} className="btn-outline text-xs">
                  Upload Your Photo <span className="text-red-500">*</span>
                </button>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <p className="text-[10px] text-red-500 mt-1 font-medium">Mandatory — required for certificate</p>
              </div>
            </div>

            <div>
              <label className="label">Full Name <span className="text-red-500">*</span></label>
              <input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Email <span className="text-red-500">*</span></label>
                <input className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Mobile <span className="text-red-500">*</span></label>
                <input className="input" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 ..." />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Aadhaar Number <span className="text-red-500">*</span></label>
                <input className="input" required value={form.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} placeholder="XXXX-XXXX-1234" />
              </div>
              <div>
                <label className="label">PAN Number <span className="text-red-500">*</span></label>
                <input className="input" required value={form.pan} onChange={(e) => set('pan', e.target.value)} placeholder="ABCDE1234F" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Password <span className="text-red-500">*</span></label>
                <input className="input" type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="label">Confirm <span className="text-red-500">*</span></label>
                <input className="input" type="password" required value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Re-enter" />
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <label className="label">Choose Investment Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((p) => (
                  <button type="button" key={p.tier} onClick={() => set('plan', p.tier)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${form.plan === p.tier ? 'border-gold-500 bg-gold-50/50 ring-1 ring-gold-500/30' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
                    <span className={`block font-semibold ${form.plan === p.tier ? 'text-gold-700' : 'text-ink-900'}`}>{p.tier}</span>
                    <span className="block text-xs text-ink-400">₹{p.payout.toLocaleString('en-IN')}/mo &middot; ₹{p.investment >= 100000 ? `${p.investment / 100000}L` : p.investment}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full text-base">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gold-600 hover:text-gold-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
