import { Link } from 'react-router-dom'
import { investmentPlans } from '../../data/seed'
import { inr } from '../../lib/utils'
import { IconCheck } from '../../components/icons'
import LeadForm from '../../components/LeadForm'

export default function InvestmentPlans() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-premium relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section relative py-16 z-10">
          <h1 className="text-display-lg font-display text-white">Investment Plans</h1>
          <p className="mt-4 max-w-2xl text-ink-400 text-lg">
            Choose a plan designed to convert your capital into a steady 12% monthly income for 12 months.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="bg-cream-50 section py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {investmentPlans.map((p) => (
            <div key={p.tier} className={`premium-card premium-card-hover p-6 relative ${p.highlight ? 'ring-1 ring-gold-500/40 shadow-gold-glow' : ''}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold-solid">Most Popular</span>
              )}
              <h3 className="text-xl font-bold text-ink-800 font-display">{p.tier} Plan</h3>
              <p className="mt-2 text-sm text-ink-500">{p.description}</p>
              <div className="mt-5 rounded-xl bg-ink-50 p-4">
                <p className="text-xs text-ink-500 uppercase tracking-wide">Investment</p>
                <p className="text-2xl font-bold text-ink-800 tabular">
                  {p.investment >= 100000 ? inr(p.investment, true) : inr(p.investment)}
                </p>
                <p className="mt-2 text-xs text-ink-500 uppercase tracking-wide">Monthly Return</p>
                <p className="text-2xl font-bold text-gold-600 tabular">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Tailored to you'}</p>
              </div>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#lead" className={`mt-6 w-full block text-center ${p.highlight ? 'btn-gold' : 'btn-outline'}`}>
                Choose {p.tier}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white border-t border-b border-ink-100 py-16">
        <div className="section">
          <h2 className="text-2xl font-bold text-ink-800 font-display text-center">Plan Comparison</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left">
                  <th className="py-3 font-semibold text-ink-500 text-xs uppercase tracking-wide">Feature</th>
                  {investmentPlans.map((p) => (
                    <th key={p.tier} className="py-3 px-4 font-semibold text-gold-700">{p.tier}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                <tr>
                  <td className="py-3 text-ink-600">Investment required</td>
                  {investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4 font-medium text-ink-800 tabular">{inr(p.investment, true)}</td>)}
                </tr>
                <tr>
                  <td className="py-3 text-ink-600">Monthly return</td>
                  {investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4 font-medium text-gold-600 tabular">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Custom'}</td>)}
                </tr>
                <tr>
                  <td className="py-3 text-ink-600">Annual ROI (approx.)</td>
                  {investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4 tabular">{p.monthlyReturn ? `${Math.round((p.monthlyReturn * 12 / p.investment) * 100)}%` : 'Varies'}</td>)}
                </tr>
                <tr>
                  <td className="py-3 text-ink-600">Performance reports</td>
                  {investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4">{p.tier === 'Premium' ? 'Quarterly' : 'Monthly'}</td>)}
                </tr>
                <tr>
                  <td className="py-3 text-ink-600">Dedicated advisor</td>
                  {investmentPlans.map((p) => <td key={p.tier} className="py-3 px-4">{p.tier === 'Standard' ? '—' : <IconCheck className="h-4 w-4 text-gold-500" />}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead" className="bg-cream-50 section py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink-800 font-display">Start Investing Today</h2>
            <p className="mt-2 text-ink-500">Fill in your details and our NISM-certified advisor will reach out to complete your KYC and onboard you.</p>
          </div>
          <div className="mt-8">
            <LeadForm type="Investment" />
          </div>
          <p className="mt-4 text-center text-sm text-ink-400">
            Already have an account? <Link to="/login" className="font-medium text-gold-600 hover:text-gold-500">Login here</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
