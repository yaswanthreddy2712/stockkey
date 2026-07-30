import { IconCheck, IconShield, IconTrend, IconChart } from '../../components/icons'

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="section py-16">
          <h1 className="text-4xl font-bold">Your Future, Our Focus</h1>
          <p className="mt-3 max-w-2xl text-brand-100">
            We are a specialised early-retirement investment platform focused on guaranteed-return models
            that convert your capital into lifelong passive income.
          </p>
        </div>
      </section>

      <section className="section py-16 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Our Story</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Stock Key Investments was founded with a single mission — to help every Indian retire early with
            dignity and financial security. We saw that most people were either too cautious (leaving money
            idle) or too reckless (chasing risky tips). We built a middle path: professionally managed,
            diversified portfolios that deliver a predictable monthly income.
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Today we manage over ₹50 Crore in assets for 500+ happy investors, with a 99% payout success rate.
            As a SEBI-registered firm led by NISM-certified experts, your capital is always in safe, transparent hands.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'SEBI Registered', value: 'Yes', icon: IconShield },
            { label: 'Experts', value: 'NISM Certified', icon: IconTrend },
            { label: 'Assets Managed', value: '₹50 Cr+', icon: IconChart },
            { label: 'Investors', value: '500+', icon: IconCheck },
          ].map((s) => (
            <div key={s.label} className="card p-6 text-center">
              <s.icon className="mx-auto h-8 w-8 text-brand-600" />
              <p className="mt-2 text-lg font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16">
        <div className="section">
          <h2 className="text-2xl font-bold text-slate-800 text-center">Our Values</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Transparency First', text: 'You see exactly where every rupee is invested and what it earns. Regular performance reports, no surprises.' },
              { title: 'Consistent Performance', text: 'Our active research and advisory approach is designed to maintain consistent performance with controlled risk.' },
              { title: 'Early Retirement Focus', text: 'Every plan is structured to create a predictable income stream that supports leaving the workforce sooner.' },
            ].map((v) => (
              <div key={v.title} className="card p-6">
                <h3 className="font-semibold text-brand-700">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Asset Classes We Manage</h2>
        <p className="mt-2 text-slate-500 text-center">Capital is deployed across a diversified set of instruments.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['Equities', 'Bonds', 'ETFs', 'IPOs', 'Options'].map((a) => (
            <div key={a} className="card p-6 text-center">
              <p className="text-lg font-bold text-brand-700">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
