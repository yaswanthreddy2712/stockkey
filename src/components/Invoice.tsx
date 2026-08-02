import { formatDate, inr } from '../lib/utils'
import type { Customer } from '../types'

interface Props {
  customer: Customer
}

export default function Invoice({ customer }: Props) {
  const invoiceId = `SKI-INV-${new Date(customer.joinDate).getFullYear()}-${customer.id.toUpperCase().replace('CUST_', '').slice(0, 6).toUpperCase()}`
  const invoiceDate = new Date(customer.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .invoice-root, .invoice-root * { visibility: visible !important; }
          .invoice-root { position: fixed; left: 0; top: 0; width: 100vw; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print mb-4 flex justify-end">
        <button onClick={() => window.print()} className="btn-gold text-sm">Download Invoice (PDF)</button>
      </div>

      <div className="invoice-root bg-white rounded-2xl p-8 max-w-3xl mx-auto relative overflow-hidden border border-ink-200">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-ink-900">
          <div>
            <h1 className="text-2xl font-bold text-ink-900 font-display tracking-tight">TAX INVOICE</h1>
            <p className="text-xs text-ink-400 mt-1">Stock Key Investments</p>
            <p className="text-xs text-ink-400">SEBI Registered · NISM-Certified Experts</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-ink-900 text-white px-4 py-2 rounded-lg">
              <p className="text-[10px] uppercase tracking-widest text-ink-400">Invoice No.</p>
              <p className="text-sm font-bold tabular">{invoiceId}</p>
            </div>
            <p className="text-xs text-ink-500 mt-2">Date: <strong>{invoiceDate}</strong></p>
          </div>
        </div>

        {/* Bill To + Company */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2 font-semibold">Bill To</p>
            <p className="font-bold text-ink-900">{customer.name}</p>
            <p className="text-sm text-ink-600">{customer.email}</p>
            <p className="text-sm text-ink-600">{customer.phone}</p>
            {customer.address && <p className="text-sm text-ink-600">{customer.address}</p>}
            <div className="mt-2 text-xs text-ink-500 space-y-0.5">
              {customer.aadhaar && <p>Aadhaar: <span className="font-medium text-ink-700">{customer.aadhaar}</span></p>}
              {customer.pan && <p>PAN: <span className="font-medium text-ink-700">{customer.pan}</span></p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2 font-semibold">From</p>
            <p className="font-bold text-ink-900">Stock Key Investments</p>
            <p className="text-sm text-ink-600">SEBI Registered Investment Advisor</p>
            <p className="text-sm text-ink-600">NISM-Certified Experts</p>
            <p className="text-sm text-ink-600">Tel: +91 70131 78382</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-ink-50 rounded-xl p-4 mb-8 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Payment Method</p>
            <p className="font-medium text-ink-800">{customer.paymentMethod || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">UTR / Transaction No.</p>
            <p className="font-medium text-ink-800 tabular">{customer.utrNumber || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Payment Status</p>
            <p className={`font-bold ${customer.paymentStatus === 'Verified' ? 'text-emerald-600' : customer.paymentStatus === 'Rejected' ? 'text-red-600' : 'text-amber-600'}`}>
              {customer.paymentStatus || 'Pending'}
            </p>
          </div>
          {customer.referenceNo && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">Reference No.</p>
              <p className="font-medium text-ink-800 tabular">{customer.referenceNo}</p>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink-900 text-left">
                <th className="py-3 font-bold text-ink-900">Description</th>
                <th className="py-3 font-bold text-ink-900 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-100">
                <td className="py-3">
                  <p className="font-semibold text-ink-800">{customer.plan} Plan — Investment</p>
                  <p className="text-xs text-ink-500">12% monthly returns for 12 months tenure</p>
                </td>
                <td className="py-3 text-right font-bold text-ink-900 tabular">{inr(customer.investedAmount, true)}</td>
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-3">
                  <p className="font-medium text-ink-700">Monthly Payout (× 12 months)</p>
                  <p className="text-xs text-ink-500">Credited monthly to registered bank account</p>
                </td>
                <td className="py-3 text-right font-medium text-ink-700 tabular">{inr(customer.monthlyPayout)}/mo</td>
              </tr>
              <tr className="border-b border-ink-100">
                <td className="py-3">
                  <p className="font-medium text-ink-700">Total Returns (12 months)</p>
                  <p className="text-xs text-ink-500">Total payout over investment tenure</p>
                </td>
                <td className="py-3 text-right font-bold text-emerald-600 tabular">{inr(customer.monthlyPayout * 12, true)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-ink-500">Investment Amount</span><span className="font-bold tabular">{inr(customer.investedAmount, true)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Tenure</span><span className="font-medium">12 Months</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Monthly Payout</span><span className="font-medium tabular">{inr(customer.monthlyPayout)}/mo</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-ink-500">Join Date</span><span className="font-medium">{formatDate(customer.joinDate)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Maturity Date</span><span className="font-medium">{formatDate(new Date(new Date(customer.joinDate).getTime() + 365 * 86400000).toISOString())}</span></div>
              <div className="flex justify-between pt-2 border-t border-amber-300">
                <span className="font-bold text-ink-900">Total Returns</span>
                <span className="font-bold text-emerald-700 text-lg tabular">{inr(customer.monthlyPayout * 12, true)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="text-xs text-ink-500 space-y-1 mb-8 border-t border-ink-100 pt-6">
          <p className="font-bold text-ink-700 mb-2">Terms & Conditions</p>
          <p>1. This invoice is generated at the time of investment registration.</p>
          <p>2. Monthly payouts of {inr(customer.monthlyPayout)} will be credited for 12 consecutive months.</p>
          <p>3. Total returns of {inr(customer.monthlyPayout * 12, true)} represent the full payout over the tenure period.</p>
          <p>4. Investment is managed by SEBI-registered, NISM-certified advisors.</p>
          <p>5. For queries, contact support at +91 70131 78382 or visit stock-sigma-seven.vercel.app</p>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between pt-6 border-t-2 border-ink-200">
          <div className="text-center">
            <div className="h-px w-40 bg-ink-300 mb-2" />
            <p className="text-xs font-semibold text-ink-600">Authorized Signatory</p>
            <p className="text-[10px] text-ink-400">Stock Key Investments</p>
          </div>
          <div className="text-center">
            <div className="h-px w-40 bg-ink-300 mb-2" />
            <p className="text-xs font-semibold text-ink-600">Customer Signature</p>
            <p className="text-[10px] text-ink-400">{customer.name}</p>
          </div>
        </div>

        <p className="text-center text-[10px] text-ink-300 mt-6">
          This is a computer-generated invoice. · SEBI Registered · NISM-Certified Experts
        </p>
      </div>
    </>
  )
}
