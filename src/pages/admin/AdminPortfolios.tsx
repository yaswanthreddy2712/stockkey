import DashboardShell from '../../components/DashboardShell'
import { useData } from '../../context/DataContext'
import Badge, { statusColor } from '../../components/ui/Badge'
import { inr, inrSigned, holdingValue, holdingPnl, holdingPnlPct, pct } from '../../lib/utils'
import { IconChart } from '../../components/icons'

export default function AdminPortfolios() {
  const { customers } = useData()

  return (
    <DashboardShell variant="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 font-display">All Portfolios</h1>
        <p className="text-ink-500 text-sm">Holdings and performance for every customer.</p>
      </div>

      <div className="space-y-4">
        {customers.map((c) => {
          const value = c.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
          const cost = c.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.avgBuyPrice), 0)
          const pnl = value - cost
          const pnlPct = cost ? (pnl / cost) * 100 : 0
          return (
            <div key={c.id} className="premium-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-50 text-gold-600 font-bold">{c.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-ink-800">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.email} &middot; {c.plan} Plan</p>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div><p className="text-xs text-ink-400">Value</p><p className="font-bold text-ink-900 tabular">{inr(value, true)}</p></div>
                  <div><p className="text-xs text-ink-400">P&L</p><p className={`font-bold tabular ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{inrSigned(pnl)}</p></div>
                  <div><p className="text-xs text-ink-400">Return</p><p className={`font-bold tabular ${pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(pnlPct)}</p></div>
                </div>
              </div>

              {c.holdings.length === 0 ? (
                <p className="text-sm text-ink-400 py-3 text-center bg-ink-50 rounded-xl">No holdings deployed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-ink-400 border-b border-ink-100">
                      <th className="py-2 font-medium text-xs uppercase tracking-wide">Instrument</th>
                      <th className="py-2 font-medium text-xs uppercase tracking-wide">Asset</th>
                      <th className="py-2 font-medium text-xs uppercase tracking-wide">Qty</th>
                      <th className="py-2 font-medium text-xs uppercase tracking-wide">Avg.</th>
                      <th className="py-2 font-medium text-xs uppercase tracking-wide">Current</th>
                      <th className="py-2 font-medium text-xs uppercase tracking-wide">P&L</th>
                    </tr></thead>
                    <tbody className="divide-y divide-ink-50">
                      {c.holdings.map((h) => {
                        const hpnl = holdingPnl(h.quantity, h.avgBuyPrice, h.currentPrice)
                        return (
                          <tr key={h.id}>
                            <td className="py-2.5"><span className="font-medium text-ink-800">{h.symbol}</span><br /><span className="text-xs text-ink-400">{h.name}</span></td>
                            <td className="py-2.5"><Badge>{h.assetClass}</Badge></td>
                            <td className="py-2.5 tabular">{h.quantity}</td>
                            <td className="py-2.5 tabular">{inr(h.avgBuyPrice)}</td>
                            <td className="py-2.5 tabular">{inr(h.currentPrice)}</td>
                            <td className={`py-2.5 font-medium tabular ${hpnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{pct(holdingPnlPct(h.avgBuyPrice, h.currentPrice))}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
        {customers.length === 0 && (
          <div className="premium-card p-12 text-center text-ink-400">
            <IconChart className="mx-auto h-10 w-10 mb-2" />
            No customers yet.
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
