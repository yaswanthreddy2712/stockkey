import LeadForm from '../../components/LeadForm'
import { IconPhone, IconMail, IconCheck } from '../../components/icons'

export default function Contact() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-premium relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section relative py-16 z-10">
          <h1 className="text-display-lg font-display text-white">Contact Us</h1>
          <p className="mt-4 max-w-2xl text-ink-400 text-lg">Have a question about investments or insurance? We are here to help.</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-cream-50 section py-16 grid gap-8 lg:grid-cols-2">
        {/* Contact info */}
        <div>
          <h2 className="text-2xl font-bold text-ink-900 font-display">Get in touch</h2>
          <p className="mt-2 text-ink-500">Reach out to us directly — our advisors respond within one business day.</p>
          <div className="mt-6 space-y-4">
            <a href="tel:+917013178382" className="premium-card premium-card-hover p-5 flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-50 text-gold-600">
                <IconPhone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-ink-500">Call us</p>
                <p className="font-semibold text-ink-800">+91 70131 78382</p>
              </div>
            </a>
            <a href="mailto:info@stockkeyinvestments.in" className="premium-card premium-card-hover p-5 flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-50 text-gold-600">
                <IconMail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-ink-500">Email us</p>
                <p className="font-semibold text-ink-800">info@stockkeyinvestments.in</p>
              </div>
            </a>
            <div className="premium-card p-5">
              <p className="text-sm text-ink-500">Office hours</p>
              <p className="font-semibold text-ink-800">Mon &ndash; Sat, 9:30 AM &ndash; 7:00 PM IST</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['SEBI Registered', 'NISM Certified Advisors', '500+ Happy Investors'].map((t) => (
                  <span key={t} className="badge-gold">
                    <IconCheck className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lead form */}
        <div>
          <h2 className="text-2xl font-bold text-ink-900 font-display">Send us a message</h2>
          <p className="mt-2 text-ink-500">Fill out the form and we will get back to you shortly.</p>
          <div className="mt-6">
            <LeadForm type="Contact" />
          </div>
        </div>
      </section>
    </div>
  )
}
