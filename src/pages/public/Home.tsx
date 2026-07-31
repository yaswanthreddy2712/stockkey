import { Link } from 'react-router-dom'
import { investmentPlans } from '../../data/seed'
import { inr } from '../../lib/utils'
import {
  IconCheck, IconShield, IconTrend, IconChart, IconWallet,
  IconHeart, IconCar, IconBike, IconStar,
} from '../../components/icons'

const tickerData = [
  { symbol: 'NIFTY 50', value: '24,532.15', change: '+1.2%', up: true },
  { symbol: 'SENSEX', value: '80,842.30', change: '+0.9%', up: true },
  { symbol: 'BANK NIFTY', value: '52,118.45', change: '-0.3%', up: false },
  { symbol: 'GOLD', value: '72,450', change: '+0.5%', up: true },
  { symbol: 'USD/INR', value: '83.42', change: '-0.1%', up: false },
  { symbol: 'NIFTY IT', value: '38,210.80', change: '+1.8%', up: true },
  { symbol: 'HDFCBANK', value: '1,687.50', change: '+0.7%', up: true },
  { symbol: 'RELIANCE', value: '2,945.20', change: '+1.1%', up: true },
]

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
      <section className="bg-ink-900 relative overflow-hidden">
        {/* Gold radial glow */}
        <div className="absolute inset-0 bg-ink-radial pointer-events-none" />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-[0.4]" />
        {/* Gradient mesh blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] bg-gold-500/[0.06] blur-[100px] rounded-full pointer-events-none" />

        <div className="section relative py-20 lg:py-28">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 badge-gold">
              <IconShield className="h-4 w-4" /> SEBI Registered &middot; NISM-Certified Experts
            </span>
            <h1 className="mt-6 text-display-xl font-display text-white">
              Invest Smart. Earn Steady.<br />
              <span className="text-gradient-gold">Retire Early.</span>
            </h1>
            <p className="mt-6 text-lg text-ink-400 max-w-2xl leading-relaxed">
              The key to your financial freedom. Transform your capital into a guaranteed monthly income through
              a diversified, professionally managed portfolio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-gold text-base px-6 py-3">Start Investing Today &rarr;</Link>
              <Link to="/plans" className="btn-outline-gold text-base px-6 py-3">View Plans</Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg">
              <div>
                <p className="text-3xl font-bold text-gold-400 tabular">500+</p>
                <p className="text-sm text-ink-400 mt-1">Happy Investors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-400 tabular">₹50Cr+</p>
                <p className="text-sm text-ink-400 mt-1">Assets Managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-400 tabular">99%</p>
                <p className="text-sm text-ink-400 mt-1">Payout Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <div className="bg-ink-850 border-y border-white/[0.04] overflow-hidden py-2.5">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...tickerData, ...tickerData].map((t, i) => (
            <div key={i} className="inline-flex items-center gap-2 mx-6 text-sm">
              <span className="text-ink-300 font-medium">{t.symbol}</span>
              <span className="text-ink-400 tabular">{t.value}</span>
              <span className={t.up ? 'text-emerald-400 tabular' : 'text-red-400 tabular'}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Plans */}
      <section className="bg-[#F7F8FB] section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-display-lg font-display text-ink-900">Choose Your Financial Path</h2>
          <p className="mt-3 text-ink-500">Pick a plan designed to give you steady monthly returns and a clear route to early retirement.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {investmentPlans.map((p) => (
            <div key={p.tier} className={`premium-card premium-card-hover p-6 relative ${p.highlight ? 'ring-1 ring-gold-500/40 shadow-gold-glow' : ''}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold-solid">Most Popular</span>
              )}
              <h3 className="text-lg font-bold text-ink-800 font-display">{p.tier} Plan</h3>
              <p className="mt-1 text-sm text-ink-500 h-10">{p.description.split('.')[0]}.</p>
              <div className="mt-5 rounded-xl bg-ink-50 p-4">
                <p className="text-xs text-ink-500 uppercase tracking-wide">Investment</p>
                <p className="text-2xl font-bold text-ink-800 tabular">{inr(p.investment, true)}</p>
                <p className="mt-2 text-xs text-ink-500 uppercase tracking-wide">Monthly Return</p>
                <p className="text-2xl font-bold text-gold-600 tabular">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Customised'}</p>
              </div>
              <ul className="mt-5 space-y-2.5">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`mt-6 w-full block text-center ${p.highlight ? 'btn-gold' : 'btn-outline'}`}>
                Choose {p.tier}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white gold-accent-top py-20">
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-display-lg font-display text-ink-900">Why Investors Choose Stock Key?</h2>
            <p className="mt-3 text-ink-500">A specialised early-retirement investment platform built on transparency and consistent performance.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((w) => (
              <div key={w.title} className="premium-card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-50 text-gold-600">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-ink-800 font-display">{w.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section className="bg-ink-premium relative overflow-hidden py-20">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 badge-gold">
              <IconShield className="h-4 w-4" /> Protect What Matters
            </span>
            <h2 className="mt-4 text-display-lg font-display text-white">Insurance Made Simple</h2>
            <p className="mt-3 text-ink-400">Beyond investing — compare and buy Health, Term, Car &amp; Bike insurance from top insurers. Get instant quotes.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {insuranceCards.map((c) => (
              <Link key={c.to} to={c.to} className="glass-card glass-card-hover p-6 group">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-white font-display">{c.title}</h3>
                <p className="mt-1.5 text-sm text-ink-400">{c.text}</p>
                <span className="mt-3 inline-block text-sm font-medium text-gold-400 group-hover:text-gold-300 transition-colors">Get a quote &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gradient-to-r from-ink-800 to-ink-900 border-y border-white/[0.04]">
        <div className="section py-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => <IconStar key={i} className="h-5 w-5 fill-current text-gold-400" />)}
            </div>
            <p className="mt-5 text-xl font-medium leading-relaxed text-white">
              &ldquo;I invested ₹5 Lakh and now receive ₹60,000 every month for a year. The transparency reports
              and consistent payouts have genuinely changed how I plan my retirement.&rdquo;
            </p>
            <p className="mt-5 font-semibold text-ink-300">&mdash; A Verified Stock Key Investor</p>
          </div>
          <div className="md:justify-self-end glass-card p-6">
            <p className="text-sm text-ink-400 uppercase tracking-wide">Short-term ROI model</p>
            <p className="mt-2 text-2xl font-bold text-white tabular">₹5,00,000 invested</p>
            <p className="text-2xl font-bold text-gold-400 tabular">&rarr; ₹60,000 / month</p>
            <p className="mt-1 text-sm text-ink-400">for 1 full year</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink-950 relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-ink-radial pointer-events-none" />
        <div className="section relative z-10 text-center">
          <h2 className="text-display-lg font-display text-white">Ready to unlock your financial freedom?</h2>
          <p className="mt-3 text-ink-400 max-w-xl mx-auto">Join hundreds of investors building a predictable income stream with Stock Key Investments.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="btn-gold text-base px-6 py-3">Start Investing Today</Link>
            <Link to="/contact" className="btn-outline-gold text-base px-6 py-3">Talk to an Advisor</Link>
          </div>
          <div className="mt-10 flex justify-center flex-wrap gap-3">
            {['SEBI Registered', 'NISM Certified', '500+ Investors'].map((t) => (
              <span key={t} className="badge-gold">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
