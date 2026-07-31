import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { IconHeart, IconShield, IconCar, IconBike, IconCheck, IconStar } from '../../components/icons'
import { inr } from '../../lib/utils'
import type { InsuranceCategory } from '../../types'
import type { ReactNode } from 'react'

const categories: {
  to: string
  key: InsuranceCategory
  icon: (p: { className?: string }) => ReactNode
  title: string
  text: string
  gradient: string
  stats: string[]
}[] = [
  {
    to: '/insurance/health', key: 'Health', icon: IconHeart, title: 'Health Insurance',
    text: 'Protect your family from rising medical costs with cashless hospitalisation at 11,000+ hospitals.',
    gradient: 'from-emerald-500/15 to-teal-500/15',
    stats: ['₹10L+ sum insured', 'Cashless hospitals', 'Annual check-up'],
  },
  {
    to: '/insurance/term', key: 'Term', icon: IconShield, title: 'Term Insurance',
    text: 'Secure your family\'s future with up to ₹1 Crore life cover at the most affordable premiums.',
    gradient: 'from-brand-500/15 to-blue-500/15',
    stats: ['Up to ₹1 Cr cover', '99% claim rate', 'Critical illness rider'],
  },
  {
    to: '/insurance/car', key: 'Car', icon: IconCar, title: 'Car Insurance',
    text: 'Complete car protection — zero depreciation, engine cover & cashless repairs at 7,500+ garages.',
    gradient: 'from-amber-500/15 to-orange-500/15',
    stats: ['Zero depreciation', 'Engine protect', '7,500+ garages'],
  },
  {
    to: '/insurance/bike', key: 'Bike', icon: IconBike, title: 'Bike Insurance',
    text: 'Instant two-wheeler insurance in 2 minutes with cashless claims and long-term policy options.',
    gradient: 'from-violet-500/15 to-purple-500/15',
    stats: ['2-min issuance', 'Cashless repairs', '5-year option'],
  },
]

export default function InsuranceHub() {
  const { insurancePlans } = useData()

  const topPlans = [...insurancePlans]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-premium relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section relative py-20 lg:py-28 z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-400 ring-1 ring-gold-500/25">
              <IconShield className="h-3.5 w-3.5" /> Compare &amp; Buy Insurance Online
            </span>
            <h1 className="mt-5 text-display-lg font-display text-white leading-tight">
              Insurance Made <span className="text-gradient-gold">Simple &amp; Transparent</span>
            </h1>
            <p className="mt-5 text-lg text-ink-400 max-w-2xl">
              Compare plans from India's top insurers. Get instant quotes, cashless claims, and dedicated
              advisory — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Instant Quotes', 'Cashless Claims', '20+ Insurers', 'Best Prices'].map((t) => (
                <span key={t} className="badge-gold">
                  <IconCheck className="h-3.5 w-3.5" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F7F8FB] section py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-display-lg font-display text-ink-900">What would you like to insure?</h2>
          <p className="mt-3 text-ink-500 text-lg">Select a category to compare plans and get a personalised quote.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {categories.map((c) => {
            const planCount = insurancePlans.filter((p) => p.category === c.key).length
            const minPremium = Math.min(...insurancePlans.filter((p) => p.category === c.key).map((p) => p.basePremium))
            return (
              <Link key={c.to} to={c.to} className="premium-card premium-card-hover p-6 group">
                <div className="flex items-start gap-4">
                  <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.gradient} ring-1 ring-ink-200/30`}>
                    <c.icon className="h-7 w-7 text-ink-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-ink-800 font-display">{c.title}</h3>
                      <span className="text-ink-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all text-lg">&rarr;</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{c.text}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {c.stats.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-xs text-ink-500">
                      <IconCheck className="h-3.5 w-3.5 text-gold-500" /> {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between text-sm">
                  <span className="text-ink-400">{planCount} plans available</span>
                  <span className="font-semibold text-gold-600">Starting {inr(minPremium)}/yr</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Top rated plans */}
      {topPlans.length > 0 && (
        <section className="section py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-700">
              <IconStar className="h-3.5 w-3.5 fill-current" /> Top Rated
            </span>
            <h2 className="mt-3 text-3xl font-bold text-ink-900 font-display">Highest Rated Plans</h2>
            <p className="mt-2 text-ink-500">Chosen by thousands of customers for superior coverage and claim support.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {topPlans.map((p, i) => (
              <div key={p.id} className="premium-card p-6 relative">
                {i === 0 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-ink-900 shadow-gold">
                    Best Overall
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-gold-500 text-sm font-semibold">
                    <IconStar className="h-4 w-4 fill-current" /> {p.rating}
                  </span>
                  {p.cashless && (
                    <span className="badge bg-emerald-50 text-emerald-700"><IconCheck className="h-3 w-3" /> Cashless</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-ink-800 font-display">{p.planName}</h3>
                <p className="text-sm text-ink-500 mt-1">by {p.insurer}</p>
                <p className="text-sm text-ink-600 mt-2 leading-relaxed">{p.tagline}</p>
                <div className="mt-4 p-3 rounded-xl bg-ink-50 text-center">
                  <p className="text-xs text-ink-400 uppercase tracking-wide">Starting from</p>
                  <p className="text-2xl font-bold text-gold-700 tabular">{inr(p.basePremium)}</p>
                  <p className="text-xs text-ink-400">per year</p>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-600">
                      <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/insurance/${p.category.toLowerCase()}`} className="mt-5 w-full btn-gold text-center block">
                  View Plans
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-white border-y border-ink-100 py-16 lg:py-20">
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-ink-900 font-display">How It Works</h2>
            <p className="mt-2 text-ink-500">Three simple steps to get insured.</p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { step: '01', title: 'Choose a Category', desc: 'Select Health, Term, Car or Bike insurance from our marketplace.' },
              { step: '02', title: 'Compare & Get Quote', desc: 'Compare plans side-by-side, use the premium calculator, and pick the best fit.' },
              { step: '03', title: 'Get Insured', desc: 'Submit your details. Our advisor will call within 24 hours to finalise your policy.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-500/15 to-gold-500/5 text-gold-700 font-bold text-lg font-display ring-1 ring-gold-500/20">
                  {s.step}
                </div>
                <h3 className="mt-4 font-bold text-ink-800 font-display">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-900 border-t border-white/[0.04] py-14">
        <div className="section grid gap-6 sm:grid-cols-3 text-center">
          {[
            { num: '20+', label: 'Insurance partners' },
            { num: '4.5\u2605', label: 'Average customer rating' },
            { num: '98%', label: 'Claim settlement rate' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-gold-400 tabular">{s.num}</p>
              <p className="text-sm text-ink-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
