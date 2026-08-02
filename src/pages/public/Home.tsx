import { Link } from 'react-router-dom'
import { investmentPlans } from '../../data/seed'
import { inr } from '../../lib/utils'
import { useReveal } from '../../hooks/useReveal'
import {
  IconCheck, IconShield, IconTrend, IconChart, IconWallet,
  IconHeart, IconCar, IconBike, IconStar, IconArrow,
} from '../../components/icons'

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
  { icon: IconShield, title: 'SEBI Registered', text: 'Operate with confidence. We are a SEBI-registered firm led by NISM-certified experts.' },
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
        {/* Gradient orbs */}
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -right-40 opacity-60" />
        <div className="orb orb-blue w-[500px] h-[500px] -bottom-60 -left-40 opacity-40" />
        <div className="orb orb-purple w-[400px] h-[400px] top-1/3 right-1/4 opacity-30" />
        <div className="absolute inset-0 dot-grid opacity-[0.4]" />
        {/* Vignette */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[rgba(17,24,39,0.55)] via-transparent to-[rgba(17,24,39,0.75)]" />
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[1] text-center select-none font-bold leading-none text-[clamp(4rem,18vw,13rem)] text-gray-700/30 tracking-[-0.04em]">
          STOCK KEY
        </div>

        <div className="relative z-20 w-full max-w-[88rem] mx-auto px-5 sm:px-8 pb-20 pt-36 lg:pt-44 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            {/* Left */}
            <div ref={hero.ref} className={`lg:col-span-7 ${hero.visible ? 'reveal-up visible' : 'reveal-up'}`}>
              <span className="inline-flex items-center gap-2 badge-sky text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> SEBI Registered &middot; NISM-Certified
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
              </div>
            </div>
            {/* Right — 3D chart */}
            <div className="lg:col-span-5 flex justify-end">
              <Hero3DChart />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="relative z-20 border-t border-gray-700/50 py-4 px-5 sm:px-8 text-[0.75rem] font-medium uppercase tracking-[0.025em] text-gray-400 flex justify-between max-w-[88rem] mx-auto w-full">
          <span>Stock Key Investments</span>
          <span className="hidden sm:inline">SEBI Registered &middot; NISM Certified</span>
          <span>Since 2020</span>
        </div>
      </section>

      {/* ═══ MARKET TICKER ═══ */}
      <div className="border-y border-gray-800/50 overflow-hidden py-2.5 bg-gray-900">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...tickerData, ...tickerData].map((t, i) => (
            <div key={i} className="inline-flex items-center gap-2 mx-6 text-sm">
              <span className="text-gray-400 font-medium">{t.symbol}</span>
              <span className="text-gray-500 tabular">{t.value}</span>
              <span className={t.up ? 'text-emerald-400 tabular' : 'text-red-400 tabular'}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ WHAT WE CREATE (3D pills) ═══ */}
      <section className="py-6 bg-gray-900">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Equities', bg: 'bg-gradient-to-br from-white to-[#e8e6e1] text-[#1a1a1a]' },
            { label: 'Bonds', bg: 'bg-gradient-to-br from-[#e8a05a] to-[#b15f2c] text-white' },
            { label: 'ETFs', bg: 'bg-gradient-to-br from-gray-700 to-gray-900 text-white' },
            { label: 'IPOs', bg: 'bg-gradient-to-br from-[#d4f5e9] to-[#34d399] text-[#064e3b]' },
          ].map((item) => (
            <div key={item.label} className={`card-3d flex flex-col items-center justify-center gap-1 h-[4.5rem] md:h-[5.25rem] rounded-full ${item.bg} font-semibold text-sm md:text-base shadow-[0_8px_18px_rgba(0,0,0,0.1)]`}>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ INVESTMENT PLANS (dark cards) ═══ */}
      <section className="py-20 bg-gray-900">
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
                  <div className="meta">
                    <span>{p.tier} Plan</span>
                  </div>
                  <div className="arrow-circle">
                    <IconArrow className="h-4 w-4 text-gray-100" />
                  </div>
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
      <section className="py-20 bg-[#f7f5f2] relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 80% 50% at 10% 0%, rgba(255,45,107,0.06), transparent 50%), radial-gradient(ellipse 70% 40% at 90% 20%, rgba(255,211,107,0.08), transparent 45%), linear-gradient(180deg,#f7f5f2 0%,#f1f0ee 40%,#eceae6 100%)' }}>
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-display-lg font-display text-[#111]">Why Investors Choose Stock Key?</h2>
            <p className="mt-3 text-[#8d8d8d]">A specialised early-retirement investment platform built on transparency and consistent performance.</p>
          </div>
          <div ref={why.ref} className={`mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${why.visible ? 'visible' : ''}`}>
            {whyChoose.map((w) => (
              <div key={w.title} className="card-3d rounded-2xl border border-[#e6e5e2] bg-white p-6 group cursor-pointer">
                <div className="icon-3d grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#e8a05a] to-[#b15f2c] text-white shadow-lg">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-[#111] font-display">{w.title}</h3>
                <p className="mt-1.5 text-sm text-[#8d8d8d] leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSURANCE (light section with 3D cards) ═══ */}
      <section className="py-20 bg-[#f4f1ec] relative" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(207,128,71,0.12), transparent 40%), radial-gradient(circle at 80% 50%, rgba(26,4,24,0.06), transparent 40%), linear-gradient(180deg,#f4f1ec,#ebe7e0)' }}>
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#111]/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111]/50" /> Protect What Matters
            </span>
            <h2 className="mt-4 text-display-lg font-display text-[#111]">Insurance Made Simple</h2>
            <p className="mt-3 text-[#8d8d8d]">Compare and buy Health, Term, Car &amp; Bike insurance from top insurers. Get instant quotes.</p>
          </div>
          <div ref={ins.ref} className={`mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${ins.visible ? 'visible' : ''}`}>
            {insuranceData.map((c) => (
              <Link key={c.to} to={c.to} className="ins-card-3d" data-ins={c.ins}>
                <div className="ico">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-[#111]">{c.title}</h3>
                <p className="text-sm text-[#8d8d8d] leading-relaxed flex-1">{c.text}</p>
                <span className="text-xs font-semibold text-[#b15f2c]">{c.hl}</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#111] mt-1">Get a quote &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ROW ═══ */}
      <section className="py-16 bg-[#f7f5f2]">
        <div className="section">
          {['Portfolio Management', 'Monthly Payouts', 'Insurance Advisory', 'Tax Planning'].map((svc, i) => (
            <div key={svc} className="flex items-center gap-4 py-5 border-t border-[#e6e5e2] group hover:bg-[#f1f0ee] hover:pl-8 transition-all duration-300 rounded-xl cursor-pointer">
              <span className="w-7 text-sm font-medium text-[#111]/40">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="flex-1 text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-[#111]">{svc}</h3>
              <div className="w-10 h-10 md:w-12 md:h-12 grid place-items-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg group-hover:translate-x-1.5 group-hover:rotate-[-15deg] group-hover:scale-110 transition-all duration-300">
                <IconArrow className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ STATS PANEL ═══ */}
      <section className="py-20 bg-[#f7f5f2]">
        <div className="section">
          <div ref={stats.ref} className={`reveal-scale ${stats.visible ? 'visible' : ''}`}>
            <div className="rounded-3xl bg-gray-900 p-8 sm:p-12 lg:p-16 text-gray-100 relative overflow-hidden">
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

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="py-16 bg-gray-900 border-y border-gray-800/50">
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
      <section className="py-20 bg-gray-900 relative overflow-hidden">
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
            {['SEBI Registered', 'NISM Certified', '500+ Investors'].map((t) => (
              <span key={t} className="badge-gold">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
