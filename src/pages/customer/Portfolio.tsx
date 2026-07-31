import DashboardShell from '../../components/DashboardShell'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import { inr, inrSigned, formatDate, holdingValue, holdingPnl, holdingPnlPct, pct } from '../../lib/utils'

const assetColor: Record<string, string> = {
  Equity: 'blue', Bond: 'purple', ETF: 'teal', IPO: 'amber', Options: 'slate',
}

export default function CustomerPortfolio() {
  const { user } = useAuth()
  const { getCustomer } = useData()
  const customer = user?.customerId ? getCustomer(user.customerId) : undefined

  if (!customer) {
    return <DashboardShell variant="customer"><div className="premium-card p-10 text-center text-ink-600">Account setup in progress.</div></DashboardShell>
  }

  const portfolioValue = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
  const cost = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.avgBuyPrice), 0)
  const pnl = portfolioValue - cost

  const tx = [...customer.transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return (
    <DashboardShell variant="customer">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 font-display">My Portfolio</h1>
        <p className="text-ink-500 text-sm">Detailed holdings, allocation and transaction history.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="premium-card gold-accent-top p-5">
          <p className="text-sm text-ink-500">Current Value</p>
          <p className="text-2xl font-bold text-ink-900 tabular">{inr(portfolioValue)}</p>
        </div>
        <div className="premium-card gold-accent-top p-5">
          <p className="text-sm text-ink-500">Invested Cost</p>
          <p className="text-2xl font-bold text-ink-900 tabular">{inr(cost)}</p>
        </div>
        <div className="premium-card gold-accent-top p-5">
          <p className="text-sm text-ink-500">Total P&L</p>
          <p className={`text-2xl font-bold tabular ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{inrSigned(pnl)}</p>
          <p className="text-xs text-ink-400 tabular">{pct(cost ? (pnl / cost) * 100 : 0)}</p>
        </div>
      </div>

      {/* Holdings */}
      <div className="premium-card p-5 mb-6">
        <h2 className="font-bold text-ink-800 mb-4 font-display">Holdings ({customer.holdings.length})</h2>
        {customer.holdings.length === 0 ? (
          <p className="text-sm text-ink-500 py-8 text-center">No holdings deployed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-ink-400 border-b border-ink-100">
                <th className="py-2 font-medium text-xs uppercase tracking-wide">Instrument</th><th className="py-2 font-medium text-xs uppercase tracking-wide">Asset</th>
                <th className="py-2 font-medium text-xs uppercase tracking-wide">Qty</th><th className="py-2 font-medium text-xs uppercase tracking-wide">Avg.</th>
                <th className="py-2 font-medium text-xs uppercase tracking-wide">Current</th><th className="py-2 font-medium text-xs uppercase tracking-wide">Value</th>
                <th className="py-2 font-medium text-xs uppercase tracking-wide">P&L</th>
              </tr></thead>
              <tbody className="divide-y divide-ink-50">
                {customer.holdings.map((h) => {
                  const hpnl = holdingPnl(h.quantity, h.avgBuyPrice, h.currentPrice)
                  return (
                    <tr key={h.id}>
                      <td className="py-3"><span className="font-semibold text-ink-800">{h.symbol}</span><br /><span className="text-xs text-ink-400">{h.name}</span></td>
                      <td className="py-3"><Badge color={assetColor[h.assetClass] as 'blue'}>{h.assetClass}</Badge></td>
                      <td className="py-3 tabular">{h.quantity}</td>
                      <td className="py-3 tabular">{inr(h.avgBuyPrice)}</td>
                      <td className="py-3 tabular">{inr(h.currentPrice)}</td>
                      <td className="py-3 font-medium tabular">{inr(holdingValue(h.quantity, h.currentPrice))}</td>
                      <td className={`py-3 font-medium tabular ${hpnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {pct(holdingPnlPct(h.avgBuyPrice, h.currentPrice))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="premium-card p-5">
        <h2 className="font-bold text-ink-800 mb-4 font-display">Transaction History ({tx.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-ink-400 border-b border-ink-100">
              <th className="py-2 font-medium text-xs uppercase tracking-wide">Date</th><th className="py-2 font-medium text-xs uppercase tracking-wide">Type</th>
              <th className="py-2 font-medium text-xs uppercase tracking-wide">Description</th><th className="py-2 font-medium text-xs uppercase tracking-wide text-right">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-ink-50">
              {tx.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 text-ink-500">{formatDate(t.date)}</td>
                  <td className="py-3"><Badge color={t.amount >= 0 ? 'green' : 'slate'}>{t.type}</Badge></td>
                  <td className="py-3 text-ink-700">{t.description}</td>
                  <td className={`py-3 text-right font-semibold tabular ${t.amount >= 0 ? 'text-emerald-600' : 'text-ink-700'}`}>{inrSigned(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
