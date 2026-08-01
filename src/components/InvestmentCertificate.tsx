import { formatDate, inr } from '../lib/utils'
import type { Customer } from '../types'

interface Props {
  customer: Customer
}

export default function InvestmentCertificate({ customer }: Props) {
  const certId = `SKC-${customer.id.toUpperCase().replace('CUST_', '')}-${new Date(customer.joinDate).getFullYear()}`

  const handlePrint = () => window.print()

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .certificate-root, .certificate-root * { visibility: visible !important; }
          .certificate-root { position: fixed; left: 0; top: 0; width: 100vw; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={handlePrint} className="btn-gold text-sm">
          Download Certificate (PDF)
        </button>
      </div>

      <div className="certificate-root bg-white border-2 border-amber-600 rounded-2xl p-8 max-w-3xl mx-auto relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-500 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-500 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-500 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-500 rounded-br-2xl" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-12 bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600">Stock Key Investments</span>
            <div className="h-px w-12 bg-amber-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink-900">Investment Certificate</h1>
          <p className="text-sm text-ink-400 mt-2">Certificate No: {certId}</p>
        </div>

        {/* Customer info + photo */}
        <div className="flex gap-6 mb-8">
          {/* Photo */}
          <div className="shrink-0">
            {customer.photo ? (
              <img src={customer.photo} alt={customer.name}
                className="w-28 h-28 rounded-xl object-cover border-2 border-amber-400" />
            ) : (
              <div className="w-28 h-28 rounded-xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-3xl font-bold text-amber-600 font-display">
                {customer.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Investor Name</p>
              <p className="font-semibold text-ink-800">{customer.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Plan</p>
              <p className="font-semibold text-amber-700">{customer.plan} Plan</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Mobile No</p>
              <p className="font-medium text-ink-700">{customer.phone}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Date of Investment</p>
              <p className="font-medium text-ink-700">{formatDate(customer.joinDate)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Aadhaar Number</p>
              <p className="font-medium text-ink-700">{customer.aadhaar || 'PENDING'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Tenure</p>
              <p className="font-medium text-ink-700">12 Months</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">PAN Number</p>
              <p className="font-medium text-ink-700">{customer.pan || 'PENDING'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Maturity Date</p>
              <p className="font-medium text-ink-700">{formatDate(new Date(new Date(customer.joinDate).getTime() + 365 * 86400000).toISOString())}</p>
            </div>
          </div>
        </div>

        {/* Investment summary */}
        <div className="bg-amber-50 rounded-xl p-5 mb-8 border border-amber-200">
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 mb-1">Investment Amount</p>
              <p className="text-xl font-bold text-ink-900 tabular">{inr(customer.investedAmount, true)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 mb-1">Monthly Payout</p>
              <p className="text-xl font-bold text-amber-700 tabular">{inr(customer.monthlyPayout)}/mo</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 mb-1">Total Returns (12 mo)</p>
              <p className="text-xl font-bold text-emerald-700 tabular">{inr(customer.monthlyPayout * 12, true)}</p>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="text-sm text-ink-600 leading-relaxed mb-8">
          <p>
            This is to certify that <strong className="text-ink-800">{customer.name}</strong> has invested
            a sum of <strong className="text-ink-800">{inr(customer.investedAmount, true)}</strong> under
            the <strong className="text-amber-700">{customer.plan} Plan</strong> of Stock Key Investments
            on <strong className="text-ink-800">{formatDate(customer.joinDate)}</strong> for a tenure
            of <strong className="text-ink-800">12 months</strong>.
          </p>
          <p className="mt-3">
            The investor is entitled to a monthly payout
            of <strong className="text-amber-700">{inr(customer.monthlyPayout)}/month</strong> for the
            duration of the investment tenure. The investment is managed by SEBI-registered,
            NISM-certified advisors.
          </p>
        </div>

        {/* Signature area */}
        <div className="flex items-end justify-between pt-6 border-t border-ink-100">
          <div className="text-center">
            <div className="h-px w-40 bg-ink-300 mb-2" />
            <p className="text-xs font-semibold text-ink-600">Authorized Signatory</p>
            <p className="text-[10px] text-ink-400">Stock Key Investments</p>
          </div>
          <div className="text-center">
            <div className="h-px w-40 bg-ink-300 mb-2" />
            <p className="text-xs font-semibold text-ink-600">Investor Signature</p>
            <p className="text-[10px] text-ink-400">{customer.name}</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-ink-300 mt-6">
          This certificate is computer-generated and valid without a physical signature.
          &middot; SEBI Registered &middot; NISM-Certified Experts
        </p>
      </div>
    </>
  )
}
