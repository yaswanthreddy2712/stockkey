import { IconCheck, IconShield, IconTrend, IconChart } from '../../components/icons'

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-premium relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section relative py-16 z-10">
          <h1 className="text-display-lg font-display text-white">Your Future, Our Focus</h1>
          <p className="mt-4 max-w-2xl text-ink-400 text-lg">
            We are a specialised early-retirement investment platform focused on guaranteed-return models
            that convert your capital into lifelong passive income.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-[#F7F8FB] section py-16 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink-800 font-display">Our Story</h2>
          <p className="mt-5 text-ink-600 leading-relaxed">
            Stock Key Investments was founded with a single mission — to help every Indian retire early with
            dignity and financial security. We saw that most people were either too cautious (leaving money
            idle) or too reckless (chasing risky tips). We built a middle path: professionally managed,
            diversified portfolios that deliver a predictable monthly income.
          </p>
          <p className="mt-4 text-ink-600 leading-relaxed">
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
            <div key={s.label} className="premium-card p-6 text-center">
              <div className="grid h-10 w-10 mx-auto place-items-center rounded-xl bg-gold-50 text-gold-600">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-lg font-bold text-ink-800 tabular">{s.value}</p>
              <p className="text-sm text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white gold-accent-top py-16">
        <div className="section">
          <h2 className="text-2xl font-bold text-ink-800 font-display text-center">Our Values</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Transparency First', text: 'You see exactly where every rupee is invested and what it earns. Regular performance reports, no surprises.' },
              { title: 'Consistent Performance', text: 'Our active research and advisory approach is designed to maintain consistent performance with controlled risk.' },
              { title: 'Early Retirement Focus', text: 'Every plan is structured to create a predictable income stream that supports leaving the workforce sooner.' },
            ].map((v) => (
              <div key={v.title} className="premium-card p-6">
                <h3 className="font-semibold text-gold-700 font-display">{v.title}</h3>
                <p className="mt-2.5 text-sm text-ink-500 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Classes */}
      <section className="bg-[#F7F8FB] section py-16">
        <h2 className="text-2xl font-bold text-ink-800 font-display text-center">Asset Classes We Manage</h2>
        <p className="mt-2 text-ink-500 text-center">Capital is deployed across a diversified set of instruments.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['Equities', 'Bonds', 'ETFs', 'IPOs', 'Options'].map((a) => (
            <div key={a} className="premium-card p-6 text-center hover:border-gold-500/30 transition-colors duration-300">
              <p className="text-lg font-bold text-ink-800 font-display">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
