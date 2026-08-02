import { useState, useRef, useEffect } from 'react'
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
  const { register, sendRegisterOTP, verifyRegisterOTP } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [form, setForm] = useState({
    name: '', email: '', phone: '', aadhaar: '', pan: '',
    plan: 'Standard' as InvestmentPlanTier, photo: '',
    paymentMethod: 'UPI (GPay/PhonePe/Paytm)' as string, utrNumber: '', referenceNo: '',
  })
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (otpTimer <= 0) return
    const t = setInterval(() => setOtpTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [otpTimer])

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('photo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSendOTP = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone) { setError('Name, email and phone are required.'); return }
    if (!form.photo) { setError('Photo is mandatory — please upload your photo.'); return }
    if (!form.aadhaar) { setError('Aadhaar number is mandatory.'); return }
    if (!form.pan) { setError('PAN number is mandatory.'); return }
    if (!form.utrNumber) { setError('UTR / Transaction number is mandatory.'); return }
    setLoading(true)
    const res = await sendRegisterOTP(form.email)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Failed to send OTP'); return }
    setStep(2); setOtpTimer(60)
    setSuccess(`OTP sent to ${form.email}`)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
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
    const res = await verifyRegisterOTP(form.email, code)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'OTP verification failed'); return }
    setOtpVerified(true)
    setSuccess('OTP verified! Click "Create Account" to complete registration.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpVerified) { setError('Please verify your OTP first.'); return }
    setError(''); setLoading(true)
    const res = await register({
      name: form.name, email: form.email, password: 'otp-auth',
      phone: form.phone, aadhaar: form.aadhaar, pan: form.pan, plan: form.plan,
      paymentMethod: form.paymentMethod, utrNumber: form.utrNumber, referenceNo: form.referenceNo,
    })
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Registration failed'); return }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Left — dark brand panel */}
      <div className="relative overflow-hidden hidden lg:flex flex-col justify-between p-12">
        <div className="orb orb-gold w-[500px] h-[500px] -top-32 -right-32 opacity-60" />
        <div className="orb orb-purple w-[400px] h-[400px] bottom-32 left-0 opacity-30" />
        <div className="absolute inset-0 dot-grid opacity-[0.07]" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg"><IconChart className="h-5 w-5" /></span>
          <span className="font-bold text-white font-display">Stock Key Investments</span>
        </Link>
        <div className="relative z-10 animate-fade-up">
          <h2 className="text-3xl font-display font-bold leading-tight text-white">
            Start your journey to early retirement.
          </h2>
          <ul className="mt-6 space-y-3">
            {['12% monthly returns', 'Diversified, professionally managed portfolio', 'Transparent performance reports', 'Insurance for health, term, car & bike'].map((t) => (
              <li key={t} className="flex items-center gap-2 text-white/60"><IconCheck className="h-5 w-5 text-sky-400 flex-shrink-0" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="relative z-10">
          <span className="badge-sky text-xs">SEBI Registered &middot; NISM-Certified Experts</span>
        </div>
      </div>

      {/* Right — dark form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-6 animate-fade-up">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg"><IconChart className="h-5 w-5" /></span>
            <span className="font-bold text-white font-display">Stock Key</span>
          </Link>

          <h1 className="text-2xl font-display font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-white/50">
            {step === 1 ? 'Fill your details and verify with OTP.' : `OTP sent to ${form.email}`}
          </p>

          {/* Step indicator */}
          <div className="mt-4 flex items-center gap-3">
            <div className={`flex items-center gap-2 text-sm font-medium ${step === 1 ? 'text-sky-400' : 'text-emerald-400'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-sky-500 text-white' : 'bg-emerald-500 text-white'}`}>1</span> Details
            </div>
            <div className="h-px flex-1 bg-white/10" />
            <div className={`flex items-center gap-2 text-sm font-medium ${step === 2 ? (otpVerified ? 'text-emerald-400' : 'text-sky-400') : 'text-white/30'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${otpVerified ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-sky-500 text-white' : 'bg-white/10 text-white/30'}`}>{otpVerified ? '✓' : '2'}</span> Verify OTP
            </div>
          </div>

          {error && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>}
          {success && <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2"><IconCheck className="h-4 w-4" /> {success}</div>}

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendOTP() }} className="mt-6 space-y-4">
              {/* Photo */}
              <div className="flex items-center gap-4">
                {form.photo ? (
                  <img src={form.photo} alt="Preview" className="h-16 w-16 rounded-xl object-cover border-2 border-sky-400" />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-white/5 border-2 border-dashed border-red-400/50 flex items-center justify-center text-xl font-bold text-red-400/50">?</div>
                )}
                <div>
                  <button type="button" onClick={() => photoRef.current?.click()} className="btn-outline text-xs">Upload Photo <span className="text-red-400">*</span></button>
                  <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  <p className="text-[10px] text-red-400 mt-1 font-medium">Mandatory — required for certificate</p>
                </div>
              </div>

              <div><label className="label">Full Name <span className="text-red-400">*</span></label><input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Email <span className="text-red-400">*</span></label><input className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" /></div>
                <div><label className="label">Mobile <span className="text-red-400">*</span></label><input className="input" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 ..." /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Aadhaar <span className="text-red-400">*</span></label><input className="input" required value={form.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} placeholder="XXXX-XXXX-1234" /></div>
                <div><label className="label">PAN <span className="text-red-400">*</span></label><input className="input" required value={form.pan} onChange={(e) => set('pan', e.target.value)} placeholder="ABCDE1234F" /></div>
              </div>

              {/* Plan */}
              <div>
                <label className="label">Choose Investment Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((p) => (
                    <button type="button" key={p.tier} onClick={() => set('plan', p.tier)}
                      className={`rounded-xl border p-3 text-left text-sm transition ${form.plan === p.tier ? 'border-sky-400 bg-sky-400/10 ring-1 ring-sky-400/30' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}>
                      <span className={`block font-semibold ${form.plan === p.tier ? 'text-sky-300' : 'text-white'}`}>{p.tier}</span>
                      <span className="block text-xs text-white/40">₹{p.payout.toLocaleString('en-IN')}/mo</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Payment Details</p>
              </div>
              <div>
                <label className="label">Payment Method <span className="text-red-400">*</span></label>
                <select className="input" required value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)}>
                  {['UPI (GPay/PhonePe/Paytm)', 'Bank Transfer / NEFT / RTGS', 'Cheque', 'Cash'].map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">UTR / Transaction No. <span className="text-red-400">*</span></label><input className="input" required value={form.utrNumber} onChange={(e) => set('utrNumber', e.target.value)} placeholder="e.g. 123456789012" /></div>
                <div><label className="label">Reference No. (optional)</label><input className="input" value={form.referenceNo} onChange={(e) => set('referenceNo', e.target.value)} placeholder="Cheque / bank ref" /></div>
              </div>

              <button type="submit" disabled={loading} className="btn-gold w-full text-base">
                {loading ? 'Sending OTP...' : 'Send OTP to Verify'}
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="mt-6 space-y-4">
              {!otpVerified ? (
                <>
                  <div>
                    <label className="label">Enter 6-digit OTP</label>
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input key={i} ref={(el) => { otpRefs.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 text-center text-lg font-bold text-white focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 outline-none transition tabular" />
                      ))}
                    </div>
                  </div>
                  <button onClick={handleVerifyOTP} disabled={loading || otp.join('').length !== 6} className="btn-gold w-full text-base disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <div className="text-center space-y-2">
                    {otpTimer > 0 ? (
                      <p className="text-sm text-white/40">Resend OTP in <strong className="text-white/70">{otpTimer}s</strong></p>
                    ) : (
                      <button onClick={handleSendOTP} className="text-sm font-medium text-sky-400 hover:text-sky-300">Resend OTP</button>
                    )}
                    <p><button onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); setSuccess('') }} className="text-sm text-white/40 hover:text-white/60">Edit details</button></p>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400">
                    <p className="font-semibold">OTP Verified!</p>
                    <p className="mt-1">Click below to create your account.</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 text-sm space-y-1">
                    <p><strong className="text-white">{form.name}</strong></p>
                    <p className="text-white/50">{form.email} &middot; {form.phone}</p>
                    <p className="text-white/50">{form.plan} Plan &middot; {form.paymentMethod}</p>
                    <p className="text-white/50">UTR: {form.utrNumber}</p>
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full text-base">
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="mt-6 text-sm text-white/40">
            Already have an account? <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
