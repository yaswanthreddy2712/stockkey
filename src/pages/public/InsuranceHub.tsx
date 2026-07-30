import { Link } from 'react-router-dom'
import { IconHeart, IconShield, IconCar, IconBike, IconCheck } from '../../components/icons'

const categories = [
  {
    to: '/insurance/health', icon: IconHeart, title: 'Health Insurance', color: 'bg-rose-50 text-rose-600',
    text: 'Comprehensive cover for you and your family against rising medical costs.',
    points: ['₹10 Lakh+ sum insured', 'Cashless at 11,000+ hospitals', 'Annual health check-up'],
  },
  {
    to: '/insurance/term', icon: IconShield, title: 'Term Insurance', color: 'bg-brand-50 text-brand-600',
    text: 'Secure your family’s future with high life cover at affordable premiums.',
    points: ['Up to ₹1 Crore cover', 'Claim settlement up to 99%', 'Critical illness riders'],
  },
  {
    to: '/insurance/car', icon: IconCar, title: 'Car Insurance', color: 'bg-amber-50 text-amber-600',
    text: 'Complete car protection with cashless repairs and zero depreciation.',
    points: ['Zero depreciation cover', 'Cashless 1,000+ workshops', 'Engine protect add-on'],
  },
  {
    to: '/insurance/bike', icon: IconBike, title: 'Bike Insurance', color: 'bg-teal-50 text-teal-600',
    text: 'Instant two-wheeler insurance with cashless claims in minutes.',
    points: ['Policy in 2 minutes', 'Cashless repairs', 'Personal accident cover'],
  },
]

export default function InsuranceHub() {
  return (
    <div>
      <section className="bg-gradient-to-br from-accent-600 to-brand-800 text-white">
        <div className="section py-16">
          <h1 className="text-4xl font-bold">Insurance Marketplace</h1>
          <p className="mt-3 max-w-2xl text-brand-100">
            Compare and buy insurance from India’s top insurers — Health, Term, Car & Bike.
            Get instant quotes, transparent premiums, and cashless claims.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Instant Quotes', 'Cashless Claims', 'Top Insurers', 'Best Prices'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
                <IconCheck className="h-3.5 w-3.5 text-accent-300" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800">What would you like to insure?</h2>
          <p className="mt-3 text-slate-600">Select a category to compare plans from leading insurers and get a personalised quote.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {categories.map((c) => (
            <Link key={c.to} to={c.to} className="card p-6 group hover:shadow-md hover:-translate-y-0.5 transition flex gap-5">
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${c.color}`}>
                <c.icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">{c.title}</h3>
                  <span className="text-brand-600 group-hover:translate-x-1 transition">→</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{c.text}</p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-1 text-xs text-slate-500">
                      <IconCheck className="h-3.5 w-3.5 text-green-600" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-200 py-14">
        <div className="section grid gap-6 sm:grid-cols-3 text-center">
          {[
            { num: '20+', label: 'Insurance partners' },
            { num: '4.5★', label: 'Average customer rating' },
            { num: '2 min', label: 'Avg. policy issuance' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-brand-700">{s.num}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
