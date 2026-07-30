import { Link } from 'react-router-dom'
import { investmentPlans } from '../../data/seed'
import { inr } from '../../lib/utils'
import {
  IconCheck, IconShield, IconTrend, IconChart, IconWallet,
  IconHeart, IconCar, IconBike, IconStar,
} from '../../components/icons'

const whyChoose = [
  { icon: IconTrend, title: 'Guaranteed Monthly Payouts', text: 'Consistent, predictable income every month — turn your capital into a lifelong passive income stream.' },
  { icon: IconChart, title: 'Transparent Reports', text: 'Regular performance reports showing total capital invested and returns earned. No hidden charges.' },
  { icon: IconWallet, title: 'Diversified Portfolio', text: 'Your capital is spread across Equities, Bonds, ETFs, IPOs and Options to balance risk and reward.' },
  { icon: IconShield, title: 'SEBI Registered', text: 'Operate with confidence. We are a SEBI-registered firm led by NISM-certified experts.' },
]

const insuranceCards = [
  { to: '/insurance/health', icon: IconHeart, title: 'Health Insurance', text: 'Protect your family from rising medical costs.' },
  { to: '/insurance/term', icon: IconShield, title: 'Term Insurance', text: '₹1 Crore life cover at affordable premiums.' },
  { to: '/insurance/car', icon: IconCar, title: 'Car Insurance', text: 'Cashless repairs & zero depreciation cover.' },
  { to: '/insurance/bike', icon: IconBike, title: 'Bike Insurance', text: 'Instant two-wheeler cover in 2 minutes.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="section relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <IconShield className="h-4 w-4 text-accent-400" /> SEBI Registered · NISM-Certified Experts
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Invest Smart. Earn Steady.<br /><span className="text-accent-400">Retire Early.</span>
            </h1>
            <p className="mt-5 text-lg text-brand-100 max-w-2xl">
              The key to your financial freedom. Transform your capital into a guaranteed monthly income through
              a diversified, professionally managed portfolio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-accent text-base">Start Investing Today →</Link>
              <Link to="/plans" className="btn border border-white/30 text-white hover:bg-white/10">View Plans</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <div><p className="text-3xl font-bold text-accent-400">500+</p><p className="text-sm text-brand-200">Happy Investors</p></div>
              <div><p className="text-3xl font-bold text-accent-400">₹50Cr+</p><p className="text-sm text-brand-200">Assets Managed</p></div>
              <div><p className="text-3xl font-bold text-accent-400">99%</p><p className="text-sm text-brand-200">Payout Success</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment plans */}
      <section className="section py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800">Choose Your Financial Path</h2>
          <p className="mt-3 text-slate-600">Pick a plan designed to give you steady monthly returns and a clear route to early retirement.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {investmentPlans.map((p) => (
            <div key={p.tier} className={`card p-6 relative ${p.highlight ? 'ring-2 ring-brand-600 shadow-lg' : ''}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-brand-700">{p.tier} Plan</h3>
              <p className="mt-1 text-sm text-slate-500 h-10">{p.description.split('.')[0]}.</p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Investment</p>
                <p className="text-2xl font-bold text-slate-800">{inr(p.investment, true)}</p>
                <p className="mt-2 text-xs text-slate-500">Monthly Return</p>
                <p className="text-2xl font-bold text-accent-600">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Customised'}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`mt-6 w-full ${p.highlight ? 'btn-primary' : 'btn-outline'}`}>
                Choose {p.tier}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-16 lg:py-20 border-y border-slate-200">
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800">Why Investors Choose Stock Key Investments?</h2>
            <p className="mt-3 text-slate-600">A specialised early-retirement investment platform built on transparency and consistent performance.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((w) => (
              <div key={w.title} className="card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{w.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance section */}
      <section className="section py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
            <IconShield className="h-4 w-4" /> Protect What Matters
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-800">Insurance Made Simple</h2>
          <p className="mt-3 text-slate-600">Beyond investing — compare and buy Health, Term, Car & Bike insurance from top insurers. Get instant quotes.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {insuranceCards.map((c) => (
            <Link key={c.to} to={c.to} className="card p-6 group hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.text}</p>
              <span className="mt-3 inline-block text-sm font-medium text-brand-600">Get a quote →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonial / performance band */}
      <section className="bg-gradient-to-r from-accent-600 to-brand-700 text-white">
        <div className="section py-14 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="flex items-center gap-1 text-accent-200">
              {[1,2,3,4,5].map((i) => <IconStar key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="mt-4 text-xl font-medium leading-relaxed">
              "I invested ₹5 Lakh and now receive ₹60,000 every month for a year. The transparency reports
              and consistent payouts have genuinely changed how I plan my retirement."
            </p>
            <p className="mt-4 font-semibold">— A Verified Stock Key Investor</p>
          </div>
          <div className="md:justify-self-end card bg-white/10 ring-1 ring-white/20 p-6 backdrop-blur">
            <p className="text-sm text-brand-100">Short-term ROI model</p>
            <p className="mt-1 text-2xl font-bold">₹5,00,000 invested</p>
            <p className="text-2xl font-bold text-accent-300">→ ₹60,000 / month</p>
            <p className="mt-1 text-sm text-brand-100">for 1 full year</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-16 lg:py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Ready to unlock your financial freedom?</h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">Join hundreds of investors building a predictable income stream with Stock Key Investments.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="btn-primary text-base">Start Investing Today</Link>
          <Link to="/contact" className="btn-outline text-base">Talk to an Advisor</Link>
        </div>
      </section>
    </div>
  )
}
