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
    return <DashboardShell variant="customer"><div className="card p-10 text-center text-slate-600">Account setup in progress.</div></DashboardShell>
  }

  const portfolioValue = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
  const cost = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.avgBuyPrice), 0)
  const pnl = portfolioValue - cost

  const tx = [...customer.transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return (
    <DashboardShell variant="customer">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Portfolio</h1>
        <p className="text-slate-500 text-sm">Detailed holdings, allocation and transaction history.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Current Value</p>
          <p className="text-2xl font-bold text-slate-800">{inr(portfolioValue)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Invested Cost</p>
          <p className="text-2xl font-bold text-slate-800">{inr(cost)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total P&L</p>
          <p className={`text-2xl font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>{inrSigned(pnl)}</p>
          <p className="text-xs text-slate-400">{pct(cost ? (pnl / cost) * 100 : 0)}</p>
        </div>
      </div>

      {/* Holdings */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold text-slate-800 mb-4">Holdings ({customer.holdings.length})</h2>
        {customer.holdings.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No holdings deployed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-2 font-medium">Instrument</th><th className="py-2 font-medium">Asset</th>
                <th className="py-2 font-medium">Qty</th><th className="py-2 font-medium">Avg.</th>
                <th className="py-2 font-medium">Current</th><th className="py-2 font-medium">Value</th>
                <th className="py-2 font-medium">P&L</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-50">
                {customer.holdings.map((h) => {
                  const hpnl = holdingPnl(h.quantity, h.avgBuyPrice, h.currentPrice)
                  return (
                    <tr key={h.id}>
                      <td className="py-3"><span className="font-semibold text-slate-800">{h.symbol}</span><br /><span className="text-xs text-slate-400">{h.name}</span></td>
                      <td className="py-3"><Badge color={assetColor[h.assetClass] as 'blue'}>{h.assetClass}</Badge></td>
                      <td className="py-3">{h.quantity}</td>
                      <td className="py-3">{inr(h.avgBuyPrice)}</td>
                      <td className="py-3">{inr(h.currentPrice)}</td>
                      <td className="py-3 font-medium">{inr(holdingValue(h.quantity, h.currentPrice))}</td>
                      <td className={`py-3 font-medium ${hpnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="card p-5">
        <h2 className="font-bold text-slate-800 mb-4">Transaction History ({tx.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-medium">Date</th><th className="py-2 font-medium">Type</th>
              <th className="py-2 font-medium">Description</th><th className="py-2 font-medium text-right">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {tx.map((t) => (
                <tr key={t.id}>
                  <td className="py-3 text-slate-500">{formatDate(t.date)}</td>
                  <td className="py-3"><Badge color={t.amount >= 0 ? 'green' : 'slate'}>{t.type}</Badge></td>
                  <td className="py-3 text-slate-700">{t.description}</td>
                  <td className={`py-3 text-right font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-slate-700'}`}>{inrSigned(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
