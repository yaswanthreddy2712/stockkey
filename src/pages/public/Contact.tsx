import LeadForm from '../../components/LeadForm'
import { IconPhone, IconMail, IconCheck } from '../../components/icons'

export default function Contact() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="section py-16">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-brand-100">Have a question about investments or insurance? We are here to help.</p>
        </div>
      </section>

      <section className="section py-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Get in touch</h2>
          <p className="mt-2 text-slate-600">Reach out to us directly — our advisors respond within one business day.</p>
          <div className="mt-6 space-y-4">
            <a href="tel:+917013178382" className="card p-5 flex items-center gap-4 hover:shadow-md transition">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><IconPhone className="h-5 w-5" /></div>
              <div><p className="text-sm text-slate-500">Call us</p><p className="font-semibold text-slate-800">+91 70131 78382</p></div>
            </a>
            <a href="mailto:info@stockkeyinvestments.in" className="card p-5 flex items-center gap-4 hover:shadow-md transition">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><IconMail className="h-5 w-5" /></div>
              <div><p className="text-sm text-slate-500">Email us</p><p className="font-semibold text-slate-800">info@stockkeyinvestments.in</p></div>
            </a>
            <div className="card p-5">
              <p className="text-sm text-slate-500">Office hours</p>
              <p className="font-semibold text-slate-800">Mon – Sat, 9:30 AM – 7:00 PM IST</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['SEBI Registered', 'NISM Certified Advisors', '500+ Happy Investors'].map((t) => (
                  <span key={t} className="badge bg-green-50 text-green-700"><IconCheck className="h-3 w-3" /> {t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">Send us a message</h2>
          <p className="mt-2 text-slate-600">Fill out the form and we will get back to you shortly.</p>
          <div className="mt-6">
            <LeadForm type="Contact" />
          </div>
        </div>
      </section>
    </div>
  )
}
