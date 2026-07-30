import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import type { InsuranceCategory, LeadType, InvestmentPlanTier } from '../types'
import { inr } from '../lib/utils'
import { IconCheck } from './icons'

interface LeadFormProps {
  type: LeadType
  insuranceCategory?: InsuranceCategory
  insurancePlanId?: string
  estimatedPremium?: number
  defaultPlan?: InvestmentPlanTier
  compact?: boolean
}

const inputCls = 'input'
const plans: InvestmentPlanTier[] = ['Premium', 'Standard', 'Customised']

export default function LeadForm({
  type, insuranceCategory, insurancePlanId, estimatedPremium, defaultPlan = 'Standard', compact = false,
}: LeadFormProps) {
  const { addLead } = useData()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', aadhaar: '',
    plan: defaultPlan as InvestmentPlanTier,
    investmentAmount: 0,
    message: '',
  })

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addLead({
      type,
      name: form.name,
      email: form.email,
      phone: form.phone,
      aadhaar: type === 'Investment' ? form.aadhaar : undefined,
      plan: type === 'Investment' ? form.plan : undefined,
      investmentAmount: type === 'Investment' ? Number(form.investmentAmount) || undefined : undefined,
      insuranceCategory: type === 'Insurance' ? insuranceCategory : undefined,
      insurancePlanId: type === 'Insurance' ? insurancePlanId : undefined,
      estimatedPremium: type === 'Insurance' ? estimatedPremium : undefined,
      message: type === 'Contact' ? form.message : undefined,
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
          <IconCheck className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Thank you, {form.name.split(' ')[0]}!</h3>
        <p className="mt-2 text-slate-600">
          {type === 'Insurance'
            ? 'Your insurance enquiry has been received. Our advisor will call you within 24 hours with a customised quote.'
            : type === 'Investment'
            ? 'Your investment request has been submitted. Our NISM-certified advisor will reach out shortly to complete your KYC.'
            : 'Your message has been sent. We will get back to you soon.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',aadhaar:'',plan:defaultPlan,investmentAmount:0,message:'' }) }} className="btn-outline">
            Submit another
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`card ${compact ? 'p-5' : 'p-6'}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Full Name *</label>
          <input className={inputCls} required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email *</label>
          <input className={inputCls} type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Mobile Number *</label>
          <input className={inputCls} required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        </div>

        {type === 'Investment' && (
          <>
            <div>
              <label className="label">Aadhaar Number</label>
              <input className={inputCls} value={form.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} placeholder="XXXX-XXXX-1234" />
            </div>
            <div>
              <label className="label">Investment Plan *</label>
              <select className={inputCls} value={form.plan} onChange={(e) => set('plan', e.target.value)}>
                {plans.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Investment Amount (₹)</label>
              <input className={inputCls} type="number" min={0} value={form.investmentAmount || ''} onChange={(e) => set('investmentAmount', e.target.value)} placeholder="e.g. 500000" />
            </div>
          </>
        )}

        {type === 'Contact' && (
          <div className="sm:col-span-2">
            <label className="label">Message *</label>
            <textarea className={inputCls} required rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="How can we help you?" />
          </div>
        )}

        {type === 'Insurance' && estimatedPremium && (
          <div className="sm:col-span-2 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800">
            Estimated premium: <span className="font-bold">{inr(estimatedPremium)}/year</span> · Category: {insuranceCategory}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-400">By submitting, you agree to be contacted by Stock Key Investments.</p>
        <button type="submit" className="btn-primary shrink-0">
          {type === 'Insurance' ? 'Get Quote' : type === 'Investment' ? 'Start Investing' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
