import { Link } from 'react-router-dom'
import { investmentPlans } from '../../data/seed'
import { inr } from '../../lib/utils'
import { IconCheck } from '../../components/icons'
import LeadForm from '../../components/LeadForm'

export default function InvestmentPlans() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="section py-16">
          <h1 className="text-4xl font-bold">Investment Plans</h1>
          <p className="mt-3 max-w-2xl text-brand-100">
            Choose a plan designed to convert your capital into a steady monthly income and a clear path to early retirement.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="section py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {investmentPlans.map((p) => (
            <div key={p.tier} className={`card p-6 relative ${p.highlight ? 'ring-2 ring-brand-600 shadow-lg' : ''}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-brand-700">{p.tier} Plan</h3>
              <p className="mt-2 text-sm text-slate-500">{p.description}</p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Investment</p>
                <p className="text-2xl font-bold text-slate-800">
                  {p.investment >= 100000 ? inr(p.investment, true) : inr(p.investment)}
                </p>
                <p className="mt-2 text-xs text-slate-500">Monthly Return</p>
                <p className="text-2xl font-bold text-accent-600">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Tailored to you'}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#lead" className={`mt-6 w-full ${p.highlight ? 'btn-primary' : 'btn-outline'}`}>
                Choose {p.tier}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="section">
          <h2 className="text-2xl font-bold text-slate-800 text-center">Plan Comparison</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 font-semibold text-slate-500">Feature</th>
                  {investmentPlans.map((p) => (
                    <th key={p.tier} className="py-3 px-4 font-semibold text-brand-700">{p.tier}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="py-3 text-slate-600">Investment required</td>{investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4 font-medium">{inr(p.investment, true)}</td>)}</tr>
                <tr><td className="py-3 text-slate-600">Monthly return</td>{investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4 font-medium text-accent-600">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Custom'}</td>)}</tr>
                <tr><td className="py-3 text-slate-600">Annual ROI (approx.)</td>{investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4">{p.monthlyReturn ? `${Math.round((p.monthlyReturn * 12 / p.investment) * 100)}%` : 'Varies'}</td>)}</tr>
                <tr><td className="py-3 text-slate-600">Performance reports</td>{investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4">{p.tier === 'Premium' ? 'Quarterly' : 'Monthly'}</td>)}</tr>
                <tr><td className="py-3 text-slate-600">Dedicated advisor</td>{investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4">{p.tier === 'Standard' ? '—' : <IconCheck className="h-4 w-4 text-green-600" />}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead" className="section py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">Start Investing Today</h2>
            <p className="mt-2 text-slate-600">Fill in your details and our NISM-certified advisor will reach out to complete your KYC and onboard you.</p>
          </div>
          <div className="mt-8">
            <LeadForm type="Investment" />
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-medium text-brand-600">Login here</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
