import { Link } from 'react-router-dom'
import { IconChart, IconPhone, IconMail } from './icons'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] relative overflow-hidden rounded-t-[2rem]">
      <div className="orb orb-gold w-[400px] h-[400px] -top-40 right-1/4 opacity-20" />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 section py-16 grid gap-10 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg">
              <IconChart className="h-5 w-5" />
            </span>
            <span className="font-bold text-white font-display text-lg">Stock Key Investments</span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">
            The key to your financial freedom. SEBI-registered early-retirement investment platform led by NISM-certified experts.
          </p>
          <div className="mt-5 flex gap-2">
            {['X', 'FB', 'IG'].map((s) => (
              <a key={s} href="#" className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/14 bg-white/[0.04] text-white/70 text-xs font-semibold hover:text-white hover:border-white/45 hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5" aria-label={s}>{s}</a>
            ))}
          </div>
        </div>

        {/* Investments */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Investments</h4>
          <ul className="space-y-2.5 text-sm">
            {['Investment Plans', 'Premium Plan', 'Standard Plan', 'Open Account'].map((t) => (
              <li key={t}><Link to="/plans" className="text-white/65 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">{t}</Link></li>
            ))}
          </ul>
        </div>

        {/* Insurance */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Insurance</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Health Insurance', to: '/insurance/health' },
              { label: 'Term Insurance', to: '/insurance/term' },
              { label: 'Car Insurance', to: '/insurance/car' },
              { label: 'Bike Insurance', to: '/insurance/bike' },
            ].map((l) => (
              <li key={l.to}><Link to={l.to} className="text-white/65 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400/10 text-sky-400"><IconPhone className="h-4 w-4" /></span>
              <span className="text-white/70">+91 70131 78382</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400/10 text-sky-400"><IconMail className="h-4 w-4" /></span>
              <span className="text-white/70">info@stockkeyinvestments.in</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 border-t border-white/[0.08]">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Stock Key Investments. SEBI Registered. All rights reserved.</p>
          <p>Investments in securities market are subject to market risks. Read all documents carefully.</p>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute inset-x-0 bottom-[-1.5rem] z-0 text-center pointer-events-none select-none font-bold leading-none text-[clamp(4rem,18vw,13rem)] text-white/[0.03] tracking-[-0.04em]">
        STOCK KEY
      </div>
    </footer>
  )
}
