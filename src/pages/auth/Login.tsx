import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IconChart, IconUser, IconDashboard, IconMail, IconCheck } from '../../components/icons'

export default function Login() {
  const { sendOTP, loginWithOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (otpTimer <= 0) return
    const t = setInterval(() => setOtpTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [otpTimer])

  const handleSendOTP = async () => {
    if (!email) { setError('Enter your email first.'); return }
    setError('')
    setSuccess('')
    setLoading(true)
    const res = await sendOTP(email)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Failed to send OTP'); return }
    setOtpSent(true)
    setOtpTimer(60)
    setSuccess(`OTP sent to ${email}`)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
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
    setError('')
    setLoading(true)
    const res = await loginWithOTP(email, code)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'OTP verification failed'); return }
    navigate(from || (res.user?.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
  }

  const quickFill = (e: string) => { setEmail(e); setError(''); setSuccess(''); setOtpSent(false); setOtp(['', '', '', '', '', '']) }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="bg-ink-900 relative overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-20 right-0 h-72 w-72 rounded-full bg-gold-500/5 blur-[100px]" />
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-500/15"><IconChart className="h-5 w-5 text-gold-500" /></span>
          <span className="font-bold text-white">Stock Key Investments</span>
        </Link>
        <div className="relative z-10 animate-fade-up">
          <h2 className="text-3xl font-display font-bold leading-tight text-white">
            Welcome back to <span className="text-gradient-gold">financial freedom.</span>
          </h2>
          <p className="mt-3 text-ink-400">Track your portfolio, monthly returns and insurance — all in one place.</p>
        </div>
        <div className="relative z-10">
          <span className="badge-gold text-xs">SEBI Registered &middot; NISM-Certified Experts</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#F7F8FB]">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-ink-900">Sign in with OTP</h1>
          <p className="mt-1 text-sm text-ink-400">Enter your email, we'll send a one-time password.</p>

          {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2"><IconCheck className="h-4 w-4" /> {success}</div>}

          <div className="mt-6">
            <label className="label">Email address</label>
            <div className="relative">
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input className="input pl-9" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={otpSent} />
            </div>
          </div>

          {!otpSent ? (
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
                      className="h-12 w-12 rounded-xl border border-ink-200 bg-white text-center text-lg font-bold text-ink-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition tabular" />
                  ))}
                </div>
              </div>
              <button onClick={handleVerifyOTP} disabled={loading || otp.join('').length !== 6} className="btn-gold w-full text-base disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <div className="text-center space-y-2">
                {otpTimer > 0 ? (
                  <p className="text-sm text-ink-400">Resend OTP in <strong className="text-ink-600">{otpTimer}s</strong></p>
                ) : (
                  <button onClick={handleSendOTP} className="text-sm font-medium text-gold-600 hover:text-gold-500">Resend OTP</button>
                )}
                <p><button onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); setError(''); setSuccess('') }} className="text-sm text-ink-400 hover:text-ink-600">Change email</button></p>
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-ink-400">
            New here? <Link to="/register" className="font-medium text-gold-600 hover:text-gold-500">Create an account</Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-gold-500/30 bg-white p-5">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Quick login — click to fill</p>
            <div className="mt-3 grid gap-2">
              <button onClick={() => quickFill('admin@stockkey.in')} className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 text-left text-sm transition hover:bg-ink-100">
                <IconDashboard className="h-4 w-4 text-gold-600" />
                <span><strong className="text-ink-900">Admin:</strong> <span className="text-ink-500">admin@stockkey.in</span></span>
              </button>
              <button onClick={() => quickFill('customer@stockkey.in')} className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 text-left text-sm transition hover:bg-ink-100">
                <IconUser className="h-4 w-4 text-gold-600" />
                <span><strong className="text-ink-900">Customer:</strong> <span className="text-ink-500">customer@stockkey.in</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
