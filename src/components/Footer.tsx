import { Link } from 'react-router-dom'
import { IconChart, IconPhone, IconMail } from './icons'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="section py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
              <IconChart className="h-5 w-5" />
            </span>
            <span className="font-bold text-white">Stock Key Investments</span>
          </div>
          <p className="text-sm text-slate-400">
            The key to your financial freedom. SEBI-registered early-retirement investment platform led by NISM-certified experts.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Investments</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/plans" className="hover:text-white">Investment Plans</Link></li>
            <li><Link to="/plans" className="hover:text-white">Premium Plan</Link></li>
            <li><Link to="/plans" className="hover:text-white">Standard Plan</Link></li>
            <li><Link to="/register" className="hover:text-white">Open Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Insurance</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/insurance/health" className="hover:text-white">Health Insurance</Link></li>
            <li><Link to="/insurance/term" className="hover:text-white">Term Insurance</Link></li>
            <li><Link to="/insurance/car" className="hover:text-white">Car Insurance</Link></li>
            <li><Link to="/insurance/bike" className="hover:text-white">Bike Insurance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Get in touch</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><IconPhone className="h-4 w-4 text-accent-400" /> +91 70131 78382</li>
            <li className="flex items-center gap-2"><IconMail className="h-4 w-4 text-accent-400" /> info@stockkeyinvestments.in</li>
          </ul>
          <div className="mt-4 flex gap-3">
            {['Facebook', 'Instagram', 'LinkedIn'].map((s) => (
              <a key={s} href="#" className="rounded-full bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700" aria-label={s}>{s[0]}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="section py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Stock Key Investments. SEBI Registered. All rights reserved.</p>
          <p>Investments in securities market are subject to market risks. Read all documents carefully.</p>
        </div>
      </div>
    </footer>
  )
}
