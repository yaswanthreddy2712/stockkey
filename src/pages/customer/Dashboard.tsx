import DashboardShell from '../../components/DashboardShell'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/ui/StatCard'
import Badge, { statusColor } from '../../components/ui/Badge'
import { inr, inrSigned, formatDate, holdingValue, holdingPnl, holdingPnlPct, pct } from '../../lib/utils'
import { IconWallet, IconTrend, IconChart, IconShield } from '../../components/icons'
import { Link } from 'react-router-dom'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const { getCustomer } = useData()
  const customer = user?.customerId ? getCustomer(user.customerId) : undefined

  if (!customer) {
    return (
      <DashboardShell variant="customer">
        <div className="card p-10 text-center">
          <p className="text-slate-600">Your account is being set up. Please check back shortly.</p>
        </div>
      </DashboardShell>
    )
  }

  const portfolioValue = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
  const investedInMarket = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.avgBuyPrice), 0)
  const totalPnl = portfolioValue - investedInMarket
  const totalPnlPct = investedInMarket ? (totalPnl / investedInMarket) * 100 : 0
  const totalReturns = customer.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const recentTx = [...customer.transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5)

  return (
    <DashboardShell variant="customer">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {customer.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 text-sm">Here’s a snapshot of your investment portfolio.</p>
        </div>
        <Badge color={statusColor(customer.status)}>{customer.status} · {customer.plan} Plan</Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Portfolio Value" value={inr(portfolioValue, true)} accent="blue" icon={<IconChart className="h-6 w-6" />} hint={`${customer.holdings.length} holdings`} />
        <StatCard label="Total Returns" value={inr(totalReturns, true)} accent="green" icon={<IconTrend className="h-6 w-6" />} hint="Payouts + dividends received" />
        <StatCard label="Unrealized P&L" value={<span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>{inrSigned(totalPnl)}</span>} accent="teal" icon={<IconWallet className="h-6 w-6" />} hint={pct(totalPnlPct)} />
        <StatCard label="Monthly Payout" value={inr(customer.monthlyPayout)} accent="amber" icon={<IconShield className="h-6 w-6" />} hint={`Invested ${inr(customer.investedAmount, true)}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Holdings preview */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Your Holdings</h2>
            <Link to="/dashboard/portfolio" className="text-sm font-medium text-brand-600">View all →</Link>
          </div>
          {customer.holdings.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No holdings yet. Your portfolio will appear here once your investment is deployed.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-medium">Symbol</th><th className="py-2 font-medium">Qty</th>
                  <th className="py-2 font-medium">Current</th><th className="py-2 font-medium">P&L</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {customer.holdings.slice(0, 5).map((h) => {
                    const pnl = holdingPnl(h.quantity, h.avgBuyPrice, h.currentPrice)
                    return (
                      <tr key={h.id}>
                        <td className="py-2.5"><span className="font-semibold text-slate-800">{h.symbol}</span><br /><span className="text-xs text-slate-400">{h.assetClass}</span></td>
                        <td className="py-2.5">{h.quantity}</td>
                        <td className="py-2.5">{inr(h.currentPrice)}</td>
                        <td className={`py-2.5 font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

        {/* Plan card + recent transactions */}
        <div className="space-y-6">
          <div className="card p-5 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
            <p className="text-sm text-brand-200">{customer.plan} Plan</p>
            <p className="mt-1 text-3xl font-bold">{inr(customer.monthlyPayout)}<span className="text-base font-normal text-brand-200">/mo</span></p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-brand-200">Invested</span><span className="font-semibold">{inr(customer.investedAmount, true)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-brand-200">KYC</span>
              <span>{customer.kycVerified ? <Badge color="green">Verified</Badge> : <Badge color="amber">Pending</Badge>}</span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-800 mb-3">Recent Activity</h3>
            <ul className="space-y-3">
              {recentTx.map((t) => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{t.type}</p>
                    <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
                  </div>
                  <span className={`font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-slate-700'}`}>{inrSigned(t.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
