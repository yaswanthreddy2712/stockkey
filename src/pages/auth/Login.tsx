import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IconChart, IconUser, IconDashboard, IconMail, IconCheck } from '../../components/icons'

export default function Login() {
  const { sendOTP, loginWithOTP, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const isAdminEmail = email === 'admin@stockkey.in'

  useEffect(() => {
    if (otpTimer <= 0) return
    const t = setInterval(() => setOtpTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [otpTimer])

  const handleSendOTP = async () => {
    if (!email) { setError('Enter your email first.'); return }
    setError(''); setSuccess(''); setLoading(true)
    const res = await sendOTP(email)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Failed to send OTP'); return }
    setOtpSent(true); setOtpTimer(60)
    setSuccess(`OTP sent to ${email}`)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const handlePasswordLogin = async () => {
    if (!email || !password) { setError('Enter email and password.'); return }
    setError(''); setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Login failed'); return }
    navigate(from || (res.user?.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]; newOtp[index] = value.slice(-1); setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
    if (e.key === 'Enter' && otp.every((d) => d)) handleVerifyOTP()
  }
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus() }
  }

  const handleVerifyOTP = async () => {
    const code = otp.join('')
    if (code.length !== 6) { setError('Enter the complete 6-digit OTP.'); return }
    setError(''); setLoading(true)
    const res = await loginWithOTP(email, code)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'OTP verification failed'); return }
    navigate(from || (res.user?.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
  }

  const quickFillAdmin = () => { setEmail('admin@stockkey.in'); setPassword(''); setError(''); setSuccess(''); setOtpSent(false); setOtp(['', '', '', '', '', '']) }
  const quickFillCustomer = () => { setEmail('customer@stockkey.in'); setPassword(''); setError(''); setSuccess(''); setOtpSent(false); setOtp(['', '', '', '', '', '']) }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-900">
      {/* Left — dark brand panel */}
      <div className="relative overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <div className="orb orb-gold w-[500px] h-[500px] -top-32 -left-32 opacity-60" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-20 right-0 opacity-30" />
        <div className="absolute inset-0 dot-grid opacity-[0.07]" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg"><IconChart className="h-5 w-5" /></span>
          <span className="font-bold text-gray-100 font-display">Stock Key</span>
        </Link>
        <div className="relative z-10 animate-fade-up">
          <h2 className="text-3xl font-display font-bold leading-tight text-gray-50">
            Welcome back to <span className="text-gradient-hero">financial freedom.</span>
          </h2>
          <p className="mt-3 text-gray-400">Track your portfolio, monthly returns and insurance — all in one place.</p>
        </div>
        <div className="relative z-10">
          <span className="badge-sky text-xs">NISM-Certified Experts</span>
        </div>
      </div>

      {/* Right — dark form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-gray-900">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg"><IconChart className="h-5 w-5" /></span>
            <span className="font-bold text-gray-100 font-display">Stock Key</span>
          </Link>

          <h1 className="text-2xl font-display font-bold text-gray-50">
            {isAdminEmail ? 'Admin Login' : 'Sign in with OTP'}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {isAdminEmail ? 'Enter your password to sign in.' : "Enter your email, we'll send a one-time password."}
          </p>

          {error && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}
          {success && <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2"><IconCheck className="h-4 w-4" /> {success}</div>}

          <div className="mt-6">
            <label className="label">Email address</label>
            <div className="relative">
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input className="input pl-9" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={otpSent && !isAdminEmail} />
            </div>
          </div>

          {/* ADMIN: password */}
          {isAdminEmail ? (
            <div className="mt-6 space-y-4">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input className="input pr-10" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <button onClick={handlePasswordLogin} disabled={loading || !password} className="btn-gold w-full text-base disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          ) : !otpSent ? (
            <button onClick={handleSendOTP} disabled={loading || !email} className="btn-gold w-full text-base mt-6 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="label">Enter 6-digit OTP</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => { otpRefs.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="h-12 w-12 rounded-xl border border-gray-700/50 bg-gray-800/60 text-center text-lg font-bold text-gray-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition tabular" />
                  ))}
                </div>
              </div>
              <button onClick={handleVerifyOTP} disabled={loading || otp.join('').length !== 6} className="btn-gold w-full text-base disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <div className="text-center space-y-2">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-500">Resend OTP in <strong className="text-gray-300">{otpTimer}s</strong></p>
                ) : (
                  <button onClick={handleSendOTP} className="text-sm font-medium text-sky-400 hover:text-sky-300">Resend OTP</button>
                )}
                <p><button onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); setError(''); setSuccess('') }} className="text-sm text-gray-500 hover:text-gray-300">Change email</button></p>
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-gray-500">
            New here? <Link to="/register" className="font-medium text-sky-400 hover:text-sky-300">Create an account</Link>
          </p>

          {/* Quick fill */}
          <div className="mt-8 rounded-xl border border-dashed border-gray-700/40 bg-gray-800/30 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick login — click to fill</p>
            <div className="mt-3 grid gap-2">
              <button onClick={quickFillAdmin} className="flex items-center gap-3 rounded-xl bg-gray-800/40 px-4 py-3 text-left text-sm transition hover:bg-gray-700/40">
                <IconDashboard className="h-4 w-4 text-sky-400" />
                <span><strong className="text-gray-100">Admin:</strong> <span className="text-gray-400">admin@stockkey.in</span> <span className="text-xs text-gray-500">(password)</span></span>
              </button>
              <button onClick={quickFillCustomer} className="flex items-center gap-3 rounded-xl bg-gray-800/40 px-4 py-3 text-left text-sm transition hover:bg-gray-700/40">
                <IconUser className="h-4 w-4 text-sky-400" />
                <span><strong className="text-gray-100">Customer:</strong> <span className="text-gray-400">customer@stockkey.in</span> <span className="text-xs text-gray-500">(OTP)</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
