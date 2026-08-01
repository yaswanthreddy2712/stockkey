import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IconChart, IconLock, IconUser, IconDashboard } from '../../components/icons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Login failed'); return }
    navigate(from || (res.user?.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
  }

  const quickFill = (e: string, p: string) => { setEmail(e); setPassword(p); setError('') }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left panel (visual) ─────────────────────────────────────── */}
      <div className="bg-ink-900 relative overflow-hidden hidden lg:flex flex-col justify-between p-12">
        {/* Decorative gold glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-20 right-0 h-72 w-72 rounded-full bg-gold-500/5 blur-[100px]" />

        {/* Dot-grid overlay */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.07]" />

        {/* Top — Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-500/15">
            <IconChart className="h-5 w-5 text-gold-500" />
          </span>
          <span className="font-bold text-white">Stock Key Investments</span>
        </Link>

        {/* Center — Heading */}
        <div className="relative z-10 animate-fade-up">
          <h2 className="text-3xl font-display font-bold leading-tight text-white">
            Welcome back to{' '}
            <span className="text-gradient-gold">financial freedom.</span>
          </h2>
          <p className="mt-3 text-ink-400">
            Track your portfolio, monthly returns and insurance — all in one place.
          </p>
        </div>

        {/* Bottom — Trust badge */}
        <div className="relative z-10">
          <span className="badge-gold text-xs">SEBI Registered &middot; NISM-Certified Experts</span>
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#F7F8FB]">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-ink-900">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-ink-400">Enter your credentials to continue.</p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  className="input pl-9"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  className="input pl-9"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-400">
            New here?{' '}
            <Link to="/register" className="font-medium text-gold-600 hover:text-gold-500">
              Create an account
            </Link>
          </p>

          {/* ── Demo accounts ─────────────────────────────────────── */}
          <div className="mt-8 rounded-xl border border-dashed border-gold-500/30 bg-white p-5">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              Demo accounts &mdash; click to autofill
            </p>
            <div className="mt-3 grid gap-2">
              <button
                onClick={() => quickFill('admin@stockkey.in', 'admin123')}
                className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 text-left text-sm transition hover:bg-ink-100"
              >
                <IconDashboard className="h-4 w-4 text-gold-600" />
                <span>
                  <strong className="text-ink-900">Admin:</strong>{' '}
                  <span className="text-ink-500">admin@stockkey.in / admin123</span>
                </span>
              </button>
              <button
                onClick={() => quickFill('customer@stockkey.in', 'customer123')}
                className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 text-left text-sm transition hover:bg-ink-100"
              >
                <IconUser className="h-4 w-4 text-gold-600" />
                <span>
                  <strong className="text-ink-900">Customer:</strong>{' '}
                  <span className="text-ink-500">customer@stockkey.in / customer123</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
