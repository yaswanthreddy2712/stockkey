import { Link } from 'react-router-dom'
import { IconChart, IconPhone, IconMail } from './icons'

export default function Footer() {
  return (
    <footer className="bg-ink-950 relative">
      {/* Gold top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="section py-14 grid gap-10 md:grid-cols-4">
        {/* Logo & description */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/20">
              <IconChart className="h-5 w-5" />
            </span>
            <span className="font-bold text-white font-display">Stock Key Investments</span>
          </div>
          <p className="text-sm text-ink-400 leading-relaxed">
            The key to your financial freedom. SEBI-registered early-retirement investment platform led by NISM-certified experts.
          </p>
        </div>

        {/* Investments */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-4">Investments</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/plans" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Investment Plans</Link></li>
            <li><Link to="/plans" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Premium Plan</Link></li>
            <li><Link to="/plans" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Standard Plan</Link></li>
            <li><Link to="/register" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Open Account</Link></li>
          </ul>
        </div>

        {/* Insurance */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-4">Insurance</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/insurance/health" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Health Insurance</Link></li>
            <li><Link to="/insurance/term" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Term Insurance</Link></li>
            <li><Link to="/insurance/car" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Car Insurance</Link></li>
            <li><Link to="/insurance/bike" className="text-ink-400 hover:text-gold-400 transition-colors duration-200">Bike Insurance</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-4">Get in touch</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <IconPhone className="h-4 w-4 text-gold-500" />
              <span className="text-ink-300">+91 70131 78382</span>
            </li>
            <li className="flex items-center gap-2.5">
              <IconMail className="h-4 w-4 text-gold-500" />
              <span className="text-ink-300">info@stockkeyinvestments.in</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            {['Facebook', 'Instagram', 'LinkedIn'].map((s) => (
              <a key={s} href="#" className="grid h-8 w-8 place-items-center rounded-full border border-ink-700 text-ink-400 text-xs font-semibold hover:border-gold-500/40 hover:text-gold-400 transition-all duration-200" aria-label={s}>{s[0]}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800/60">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500">
          <p>&copy; {new Date().getFullYear()} Stock Key Investments. SEBI Registered. All rights reserved.</p>
          <p>Investments in securities market are subject to market risks. Read all documents carefully.</p>
        </div>
      </div>
    </footer>
  )
}
