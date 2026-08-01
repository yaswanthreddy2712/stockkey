import { useState, useEffect } from 'react'
import DashboardShell from '../../components/DashboardShell'
import { useData } from '../../context/DataContext'
import { api } from '../../lib/api'

const templates = [
  { key: 'welcome', name: 'Welcome Email', desc: 'Sent when a new customer registers' },
  { key: 'paymentVerified', name: 'Payment Verified', desc: 'Sent when admin verifies payment' },
  { key: 'paymentRejected', name: 'Payment Rejected', desc: 'Sent when admin rejects payment' },
  { key: 'monthlyPayout', name: 'Monthly Payout', desc: 'Sent when monthly payout is credited' },
]

export default function AdminBroadcast() {
  const { customers } = useData()
  const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null)
  const [smtpHost, setSmtpHost] = useState('')
  const [smtpUser, setSmtpUser] = useState('')
  const [mode, setMode] = useState<'broadcast' | 'single' | 'templates'>('broadcast')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('All')
  const [singleEmail, setSingleEmail] = useState('')
  const [singleTemplate, setSingleTemplate] = useState('welcome')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')

  useEffect(() => {
    api.checkEmailConfig().then((res) => {
      setSmtpConfigured(res.configured)
      setSmtpHost(res.host || '')
      setSmtpUser(res.user || '')
    }).catch(() => setSmtpConfigured(false))
  }, [])

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setResult('')
    try {
      const res = await api.broadcastEmail(subject, body, audience)
      if (res.error) { setResult(`Error: ${res.error}`) }
      else { setResult(`Sent to ${res.sent} customers (${res.failed} failed out of ${res.total})`); setSubject(''); setBody('') }
    } catch (err: any) { setResult(`Failed: ${err.message}`) }
    setSending(false)
  }

  const handleSingle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!singleEmail) return
    setSending(true)
    setResult('')
    try {
      const c = customers.find((c) => c.email === singleEmail)
      const res = await api.sendEmail(singleEmail, singleTemplate, { name: c?.name || 'Investor', amount: c?.monthlyPayout })
      if (res.error) setResult(`Error: ${res.error}`)
      else setResult(`Email sent to ${singleEmail}`)
    } catch (err: any) { setResult(`Failed: ${err.message}`) }
    setSending(false)
  }

  return (
    <DashboardShell variant="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 font-display">Email Center</h1>
        <p className="text-ink-500 text-sm">Send promotional emails, broadcast updates, and manage transactional templates.</p>
      </div>

      {/* SMTP Status */}
      <div className={`premium-card p-4 mb-6 flex items-center gap-3 ${smtpConfigured === false ? 'border-l-4 border-amber-500' : smtpConfigured ? 'border-l-4 border-emerald-500' : ''}`}>
        <div className={`h-3 w-3 rounded-full ${smtpConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <div>
          <p className="text-sm font-semibold text-ink-800">
            {smtpConfigured === null ? 'Checking SMTP...' : smtpConfigured ? 'SMTP Configured' : 'SMTP Not Configured'}
          </p>
          {smtpConfigured && <p className="text-xs text-ink-400">{smtpHost} &middot; {smtpUser}</p>}
          {!smtpConfigured && smtpConfigured !== null && (
            <p className="text-xs text-ink-500 mt-1">
              Add SMTP env vars to Vercel: <code className="bg-ink-100 px-1 rounded text-ink-700">SMTP_HOST</code>, <code className="bg-ink-100 px-1 rounded text-ink-700">SMTP_PORT</code>, <code className="bg-ink-100 px-1 rounded text-ink-700">SMTP_USER</code>, <code className="bg-ink-100 px-1 rounded text-ink-700">SMTP_PASS</code>
            </p>
          )}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        {([['broadcast', 'Broadcast to All'], ['single', 'Send to One'], ['templates', 'Templates']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setMode(k)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === k ? 'bg-gold-500 text-ink-900' : 'bg-white text-ink-600 border border-ink-200 hover:border-gold-500/30'}`}>{label}</button>
        ))}
      </div>

      {result && (
        <div className={`rounded-xl px-4 py-3 text-sm mb-6 ${result.startsWith('Error') || result.startsWith('Failed') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{result}</div>
      )}

      {/* Broadcast */}
      {mode === 'broadcast' && (
        <form onSubmit={handleBroadcast} className="premium-card p-6 space-y-4">
          <h3 className="font-bold text-ink-800 font-display">Broadcast Email</h3>
          <div>
            <label className="label">Audience</label>
            <select className="input" value={audience} onChange={(e) => setAudience(e.target.value)}>
              {['All', 'Active', 'Pending'].map((a) => <option key={a} value={a}>{a} ({a === 'All' ? customers.length : customers.filter((c) => c.status === a).length} customers)</option>)}
            </select>
          </div>
          <div>
            <label className="label">Subject *</label>
            <input className="input" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Market Update: Q4 Results Are In!" />
          </div>
          <div>
            <label className="label">Email Body *</label>
            <textarea className="input" rows={8} required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your email content here. Use {name} to personalize with customer name." />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={sending || !smtpConfigured} className="btn-gold disabled:opacity-50">
              {sending ? 'Sending...' : `Send to ${audience === 'All' ? customers.length : customers.filter((c) => c.status === audience).length} customers`}
            </button>
          </div>
        </form>
      )}

      {/* Single email */}
      {mode === 'single' && (
        <form onSubmit={handleSingle} className="premium-card p-6 space-y-4">
          <h3 className="font-bold text-ink-800 font-display">Send Transactional Email</h3>
          <div>
            <label className="label">Recipient Email *</label>
            <input className="input" required type="email" value={singleEmail} onChange={(e) => setSingleEmail(e.target.value)} placeholder="customer@example.com" list="customer-emails" />
            <datalist id="customer-emails">
              {customers.map((c) => <option key={c.id} value={c.email}>{c.name}</option>)}
            </datalist>
          </div>
          <div>
            <label className="label">Template *</label>
            <select className="input" value={singleTemplate} onChange={(e) => setSingleTemplate(e.target.value)}>
              {templates.map((t) => <option key={t.key} value={t.key}>{t.name} — {t.desc}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={sending || !smtpConfigured} className="btn-gold disabled:opacity-50">
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      )}

      {/* Templates preview */}
      {mode === 'templates' && (
        <div className="space-y-4">
          {templates.map((t) => (
            <div key={t.key} className="premium-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-ink-800">{t.name}</h4>
                  <p className="text-sm text-ink-500">{t.desc}</p>
                </div>
                <button onClick={() => { setMode('single'); setSingleTemplate(t.key) }} className="btn-outline text-xs">Use Template</button>
              </div>
            </div>
          ))}
          <div className="premium-card p-5 border-l-4 border-gold-500">
            <h4 className="font-bold text-ink-800 mb-2">SMTP Setup Instructions</h4>
            <div className="text-sm text-ink-600 space-y-2">
              <p>Add these environment variables in your <strong>Vercel Dashboard → Settings → Environment Variables</strong>:</p>
              <div className="bg-ink-50 rounded-lg p-3 font-mono text-xs space-y-1">
                <p><span className="text-ink-400">SMTP_HOST</span>=smtp.gmail.com</p>
                <p><span className="text-ink-400">SMTP_PORT</span>=587</p>
                <p><span className="text-ink-400">SMTP_USER</span>=your-email@gmail.com</p>
                <p><span className="text-ink-400">SMTP_PASS</span>=your-app-password</p>
              </div>
              <p className="text-xs text-ink-400">For Gmail, use an <strong>App Password</strong> (not your regular password). Generate one at <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-gold-600 underline">myaccount.google.com/apppasswords</a></p>
              <p className="text-xs text-ink-400">For other providers: Use your SMTP credentials from Zoho, Outlook, Amazon SES, etc.</p>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
