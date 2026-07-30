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
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-brand-900 to-brand-700 text-white p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><IconChart className="h-5 w-5" /></span>
          <span className="font-bold">Stock Key Investments</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Welcome back to financial freedom.</h2>
          <p className="mt-3 text-brand-100">Track your portfolio, monthly returns and insurance — all in one place.</p>
        </div>
        <p className="text-xs text-brand-200">SEBI Registered · NISM-Certified Experts</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-800">Sign in to your account</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your credentials to continue.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input className="input pl-9" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input className="input pl-9" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">New here? <Link to="/register" className="font-medium text-brand-600">Create an account</Link></p>

          {/* Demo accounts */}
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Demo accounts — click to autofill</p>
            <div className="mt-3 grid gap-2">
              <button onClick={() => quickFill('admin@stockkey.in', 'admin123')} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-left text-sm hover:bg-slate-100">
                <IconDashboard className="h-4 w-4 text-brand-600" />
                <span><strong>Admin:</strong> admin@stockkey.in / admin123</span>
              </button>
              <button onClick={() => quickFill('customer@stockkey.in', 'customer123')} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-left text-sm hover:bg-slate-100">
                <IconUser className="h-4 w-4 text-accent-600" />
                <span><strong>Customer:</strong> customer@stockkey.in / customer123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
