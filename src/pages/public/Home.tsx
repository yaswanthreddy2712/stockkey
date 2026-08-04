import { useState } from 'react'
import { Link } from 'react-router-dom'
import { investmentPlans } from '../../data/seed'
import { inr } from '../../lib/utils'
import { useReveal } from '../../hooks/useReveal'
import {
  IconCheck, IconShield, IconTrend, IconChart, IconWallet,
  IconHeart, IconCar, IconBike, IconStar, IconArrow,
} from '../../components/icons'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import AssetDetailModal from '../../components/AssetDetailModal'

declare global {
  interface Window {
    __openChat?: () => void
  }
}

const tickerData = [
  { symbol: 'NIFTY 50', value: '24,532.15', change: '+1.2%', up: true },
  { symbol: 'SENSEX', value: '80,842.30', change: '+0.9%', up: true },
  { symbol: 'BANK NIFTY', value: '52,118.45', change: '-0.3%', up: false },
  { symbol: 'GOLD', value: '₹72,450', change: '+0.5%', up: true },
  { symbol: 'USD/INR', value: '83.42', change: '-0.1%', up: false },
  { symbol: 'NIFTY IT', value: '38,210.80', change: '+1.8%', up: true },
  { symbol: 'HDFCBANK', value: '1,687.50', change: '+0.7%', up: true },
  { symbol: 'RELIANCE', value: '2,945.20', change: '+1.1%', up: true },
]

const whyChoose = [
  { icon: IconTrend, title: 'Guaranteed Monthly Payouts', text: 'Consistent, predictable income every month — turn your capital into a lifelong passive income stream.' },
  { icon: IconChart, title: 'Transparent Reports', text: 'Regular performance reports showing total capital invested and returns earned. No hidden charges.' },
  { icon: IconWallet, title: 'Diversified Portfolio', text: 'Your capital is spread across Equities, Bonds, ETFs, IPOs and Options to balance risk and reward.' },
  { icon: IconShield, title: 'NISM Certified Experts', text: 'Operate with confidence. Our team is led by NISM-certified experts with deep market knowledge.' },
]

const insuranceData = [
  { to: '/insurance/health', ins: 'health', icon: IconHeart, title: 'Health Insurance', text: 'Protect your family from rising medical costs with comprehensive health coverage.', hl: 'Starting ₹1,200/mo' },
  { to: '/insurance/term', ins: 'term', icon: IconShield, title: 'Term Insurance', text: '₹1 Crore life cover at affordable premiums. Secure your family future.', hl: 'Starting ₹499/mo' },
  { to: '/insurance/car', ins: 'car', icon: IconCar, title: 'Car Insurance', text: 'Cashless repairs at 1,000+ workshops with zero depreciation cover.', hl: 'Starting ₹3,500/yr' },
  { to: '/insurance/bike', ins: 'bike', icon: IconBike, title: 'Bike Insurance', text: 'Instant two-wheeler cover in 2 minutes with cashless claims.', hl: 'Starting ₹450/yr' },
]

const chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const chartHeights = [35, 52, 48, 68, 75, 88]

function Hero3DChart() {
  const { ref, visible } = useReveal(0.2)
  return (
    <div ref={ref} className="chart-3d-wrap w-full max-w-sm">
      <div className="relative z-10 flex justify-between items-center mb-3">
        <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-sky-300/55">Portfolio Growth</span>
        <span className="text-xs font-bold text-sky-300 tabular">+12% monthly</span>
      </div>
      <div className="chart-3d">
        {chartMonths.map((m, i) => (
          <div key={m} className="bar" style={{ '--h': visible ? `${chartHeights[i]}%` : '0%' } as React.CSSProperties}>
            <div className="face" />
            <div className="top-face" />
            <div className="side-face" />
            <span className="bar-label">{m}</span>
          </div>
        ))}
        <div className="chart-floor" />
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const hero = useReveal(0.1)
  const plans = useReveal(0.1)
  const why = useReveal(0.1)
  const ins = useReveal(0.1)
  const stats = useReveal(0.15)
  const cta = useReveal(0.15)

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden rounded-b-[2rem]">
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -right-40 opacity-60" />
        <div className="orb orb-blue w-[500px] h-[500px] -bottom-60 -left-40 opacity-40" />
        <div className="orb orb-purple w-[400px] h-[400px] top-1/3 right-1/4 opacity-30" />
        <div className="absolute inset-0 dot-grid opacity-[0.4]" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-dark-vignette-start via-transparent to-dark-vignette-end" />
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[1] text-center select-none font-bold leading-none text-[clamp(4rem,18vw,13rem)] text-gray-700/30 tracking-[-0.04em]">
          STOCK KEY
        </div>

        <div className="relative z-20 w-full max-w-[88rem] mx-auto px-5 sm:px-8 pb-20 pt-36 lg:pt-44 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div ref={hero.ref} className={`lg:col-span-7 ${hero.visible ? 'reveal-up visible' : 'reveal-up'}`}>
              <span className="inline-flex items-center gap-2 badge-sky text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> NISM-Certified Experts
              </span>
              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-gray-50 leading-[0.98] tracking-tight">
                Invest Smart.<br />
                Earn Steady.<br />
                <span className="text-gradient-hero">Retire Early.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
                The key to your financial freedom. Transform your capital into a guaranteed monthly income through
                a diversified, professionally managed portfolio.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-gold btn-3d text-base px-7 py-3.5">Start Investing Today &rarr;</Link>
                <Link to="/plans" className="btn-outline text-base px-7 py-3.5">View Plans</Link>
                <button onClick={() => window.__openChat?.()} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300 text-base font-semibold hover:bg-sky-400/20 hover:border-sky-400/50 transition-all duration-300 hover:scale-[1.02]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Talk to AI
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-end">
              <Hero3DChart />
            </div>
          </div>
        </div>

        <div className="relative z-20 border-t py-4 px-5 sm:px-8 text-[0.75rem] font-medium uppercase tracking-[0.025em] flex justify-between max-w-[88rem] mx-auto w-full" style={{ borderColor: 'var(--border-dark)', color: 'var(--text-muted)' }}>
          <span>Stock Key Investments</span>
          <span className="hidden sm:inline">NISM Certified &middot; Trusted by 500+ Investors</span>
          <span>Since 2020</span>
        </div>
      </section>

      {/* ═══ MARKET TICKER ═══ */}
      <div className="border-y overflow-hidden py-2.5" style={{ borderColor: 'var(--border-dark-subtle)', background: 'var(--bg-dark)' }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {[...tickerData, ...tickerData].map((t, i) => (
            <div key={i} className="inline-flex items-center gap-2 mx-6 text-sm">
              <span className="font-medium" style={{ color: 'var(--text-muted)' }}>{t.symbol}</span>
              <span className="tabular" style={{ color: 'var(--text-faint)' }}>{t.value}</span>
              <span className={t.up ? 'text-emerald-400 tabular' : 'text-red-400 tabular'}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ WHAT WE CREATE (3D pills) ═══ */}
      <section className="py-6" style={{ background: 'var(--bg-dark)' }}>
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Equities', bg: 'bg-gradient-to-br from-white to-cream-400 text-cream-700' },
            { label: 'Bonds', bg: 'bg-gradient-to-br from-gold-200 to-gold-700 text-white' },
            { label: 'ETFs', bg: 'bg-gradient-to-br from-gray-700 to-gray-900 text-white' },
            { label: 'IPOs', bg: 'bg-gradient-to-br from-emerald-100 to-emerald-400 text-emerald-900' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setSelectedAsset(item.label)}
              className={`card-3d flex flex-col items-center justify-center gap-1 h-[4.5rem] md:h-[5.25rem] rounded-full ${item.bg} font-semibold text-sm md:text-base shadow-[0_8px_18px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ INVESTMENT PLANS ═══ */}
      <section className="py-20" style={{ background: 'var(--bg-dark)' }}>
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 badge-sky"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Investment Plans</span>
            <h2 className="mt-4 text-display-lg font-display text-gray-50">Choose Your Financial Path</h2>
            <p className="mt-3 text-gray-400">Pick a plan designed to give you steady monthly returns and a clear route to early retirement.</p>
          </div>
          <div ref={plans.ref} className={`mt-12 grid gap-6 md:grid-cols-3 stagger-children ${plans.visible ? 'visible' : ''}`}>
            {investmentPlans.map((p) => (
              <div key={p.tier} className={`plan-card-dark ${p.highlight ? 'ring-1 ring-gold-500/40' : ''}`}>
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold-solid">Most Popular</span>
                )}
                <div className="flex justify-between items-start">
                  <div className="meta"><span>{p.tier} Plan</span></div>
                  <div className="arrow-circle"><IconArrow className="h-4 w-4 text-gray-100" /></div>
                </div>
                <div className="mt-8">
                  <p className="text-3xl font-bold text-sky-300 tabular">{inr(p.investment, true)}</p>
                  <p className="text-sm text-gray-400 mt-1">Monthly return: <span className="text-sky-300 font-semibold">{p.monthlyReturn ? inr(p.monthlyReturn) : 'Customised'}</span></p>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{p.tier} Plan</h3>
                <p className="mt-2 text-sm text-gray-400 max-w-[28rem]">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.features.slice(0, 3).map((f) => (
                    <span key={f} className="inline-flex border border-gray-600/40 rounded-full px-4 py-2 text-xs">{f}</span>
                  ))}
                </div>
                <Link to="/register" className="cta-plan mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200 transition-colors">
                  Choose {p.tier} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US (light section) ═══ */}
      <section className="py-20 relative overflow-hidden bg-cream" style={{ background: 'radial-gradient(ellipse 80% 50% at 10% 0%, rgba(255,45,107,0.06), transparent 50%), radial-gradient(ellipse 70% 40% at 90% 20%, rgba(255,211,107,0.08), transparent 45%), linear-gradient(180deg, var(--bg-light) 0%, var(--bg-light-mid) 40%, var(--bg-light-deep) 100%)' }}>
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-display-lg font-display text-cream-700">Why Investors Choose Stock Key?</h2>
            <p className="mt-3 text-cream-500">A specialised early-retirement investment platform built on transparency and consistent performance.</p>
          </div>
          <div ref={why.ref} className={`mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${why.visible ? 'visible' : ''}`}>
            {whyChoose.map((w) => (
              <div key={w.title} className="card-3d rounded-2xl border bg-white p-6 group cursor-pointer" style={{ borderColor: 'var(--border-light)' }}>
                <div className="icon-3d grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold-200 to-gold-700 text-white shadow-lg">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-cream-700 font-display">{w.title}</h3>
                <p className="mt-1.5 text-sm text-cream-500 leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSURANCE (light section) ═══ */}
      <section className="py-20 relative" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(207,128,71,0.12), transparent 40%), radial-gradient(circle at 80% 50%, rgba(26,4,24,0.06), transparent 40%), linear-gradient(180deg, #f4f1ec, #ebe7e0)' }}>
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cream-700/70">
              <span className="w-1.5 h-1.5 rounded-full bg-cream-700/50" /> Protect What Matters
            </span>
            <h2 className="mt-4 text-display-lg font-display text-cream-700">Insurance Made Simple</h2>
            <p className="mt-3 text-cream-500">Compare and buy Health, Term, Car &amp; Bike insurance from top insurers. Get instant quotes.</p>
          </div>
          <div ref={ins.ref} className={`mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${ins.visible ? 'visible' : ''}`}>
            {insuranceData.map((c) => (
              <Link key={c.to} to={c.to} className="ins-card-3d" data-ins={c.ins}>
                <div className="ico"><c.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold text-cream-700">{c.title}</h3>
                <p className="text-sm text-cream-500 leading-relaxed flex-1">{c.text}</p>
                <span className="text-xs font-semibold" style={{ color: 'var(--gold-warm)' }}>{c.hl}</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-cream-700 mt-1">Get a quote &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ROW ═══ */}
      <section className="py-16 bg-cream">
        <div className="section">
          {['Portfolio Management', 'Monthly Payouts', 'Insurance Advisory', 'Tax Planning'].map((svc, i) => (
            <div key={svc} className="flex items-center gap-4 py-5 border-t group transition-all duration-300 rounded-xl cursor-pointer hover:pl-8" style={{ borderColor: 'var(--border-light)' }}>
              <span className="w-7 text-sm font-medium text-cream-700/40">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="flex-1 text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-cream-700">{svc}</h3>
              <div className="w-10 h-10 md:w-12 md:h-12 grid place-items-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg group-hover:translate-x-1.5 group-hover:rotate-[-15deg] group-hover:scale-110 transition-all duration-300">
                <IconArrow className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ STATS PANEL ═══ */}
      <section className="py-20 bg-cream">
        <div className="section">
          <div ref={stats.ref} className={`reveal-scale ${stats.visible ? 'visible' : ''}`}>
            <div className="rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden" style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
              <div className="orb orb-gold w-[300px] h-[300px] -top-20 -right-20 opacity-50" />
              <div className="orb orb-blue w-[250px] h-[250px] bottom-0 left-0 opacity-30" />
              <div className="absolute inset-0 dot-grid opacity-30" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-gold-400" /> Our Track Record
                </span>
                <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  {[
                    { num: '500+', label: 'Happy Investors' },
                    { num: '₹50Cr+', label: 'Assets Under Management' },
                    { num: '12%', label: 'Monthly Returns' },
                    { num: '99%', label: 'Payout Success Rate' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-4xl lg:text-5xl font-bold tabular text-gradient-hero">{s.num}</p>
                      <p className="mt-3 text-sm text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RETURNS GROWTH CHART ═══ */}
      <section className="py-20" style={{ background: 'var(--bg-dark)' }}>
        <div className="section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 badge-sky"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Returns Calculator</span>
            <h2 className="mt-4 text-display-lg font-display text-gray-50">Watch Your Money Grow</h2>
            <p className="mt-3 text-gray-400">See how a ₹5 Lakh investment grows with 12% monthly returns over 12 months</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">Invested</p>
                  <p className="text-xl font-bold text-gray-100 tabular">₹5.0L</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">Monthly</p>
                  <p className="text-xl font-bold text-emerald-400 tabular">₹60K</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">Total Returns</p>
                  <p className="text-xl font-bold text-sky-400 tabular">₹7.2L</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">ROI</p>
                  <p className="text-xl font-bold text-amber-400 tabular">144%</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Start', value: 500000, returns: 0 },
                    { month: 'M1', value: 560000, returns: 60000 },
                    { month: 'M2', value: 620000, returns: 120000 },
                    { month: 'M3', value: 680000, returns: 180000 },
                    { month: 'M4', value: 740000, returns: 240000 },
                    { month: 'M5', value: 800000, returns: 300000 },
                    { month: 'M6', value: 860000, returns: 360000 },
                    { month: 'M7', value: 920000, returns: 420000 },
                    { month: 'M8', value: 980000, returns: 480000 },
                    { month: 'M9', value: 1040000, returns: 540000 },
                    { month: 'M10', value: 1100000, returns: 600000 },
                    { month: 'M11', value: 1160000, returns: 660000 },
                    { month: 'M12', value: 1220000, returns: 720000 },
                  ]}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                    <Tooltip
                      contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      formatter={(v: number) => [`₹${(v/100000).toFixed(2)}L`, '']}
                    />
                    <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#0ea5e9" fill="url(#colorVal)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="returns" name="Returns Earned" stroke="#10b981" fill="url(#colorRet)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <Link to="/plans" className="btn-gold btn-3d text-sm px-6 py-2.5">View All Plans &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="py-16 border-y" style={{ background: 'var(--bg-dark)', borderColor: 'var(--border-dark-subtle)' }}>
        <div className="section grid gap-10 md:grid-cols-2 items-center">
          <div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => <IconStar key={i} className="h-5 w-5 fill-current text-gold-400" />)}
            </div>
            <p className="mt-5 text-xl font-medium leading-relaxed text-gray-100">
              &ldquo;I invested ₹5 Lakh and now receive ₹60,000 every month for a year. The transparency reports
              and consistent payouts have genuinely changed how I plan my retirement.&rdquo;
            </p>
            <p className="mt-5 font-semibold text-gray-400">&mdash; A Verified Stock Key Investor</p>
          </div>
          <div className="md:justify-self-end glass-3d rounded-2xl p-6">
            <p className="text-sm text-gray-400 uppercase tracking-wide">Short-term ROI model</p>
            <p className="mt-2 text-2xl font-bold text-gray-100 tabular">₹5,00,000 invested</p>
            <p className="text-2xl font-bold text-sky-300 tabular">&rarr; ₹60,000 / month</p>
            <p className="mt-1 text-sm text-gray-400">for 1 full year</p>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg-dark)' }}>
        <div className="orb orb-gold w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div ref={cta.ref} className={`section relative z-10 text-center reveal-up ${cta.visible ? 'visible' : ''}`}>
          <h2 className="text-display-lg font-display text-gray-50">Ready to unlock your financial freedom?</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">Join hundreds of investors building a predictable income stream with Stock Key Investments.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="btn-gold btn-3d text-base px-7 py-3.5">Start Investing Today</Link>
            <Link to="/contact" className="btn-outline text-base px-7 py-3.5">Talk to an Advisor</Link>
          </div>
          <div className="mt-10 flex justify-center flex-wrap gap-3">
            {['NISM Certified', '500+ Investors', 'Transparent Reports'].map((t) => (
              <span key={t} className="badge-gold">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {selectedAsset && <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}
    </div>
  )
}
