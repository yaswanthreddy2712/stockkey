import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { motion } from 'framer-motion'
import { LayoutDashboard, BarChart3, TrendingUp, Wallet, Shield, ArrowUpRight, ArrowDownRight, Clock, ArrowLeftRight } from 'lucide-react'
import { inr, inrSigned, formatDate, holdingValue, holdingPnl, holdingPnlPct, pct } from '../../lib/utils'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const assetColor: Record<string, string> = {
  Equity: 'from-blue-500 to-cyan-400',
  Bond: 'from-purple-500 to-pink-400',
  ETF: 'from-emerald-500 to-teal-400',
  IPO: 'from-amber-500 to-orange-400',
  Options: 'from-gray-500 to-slate-400',
}

export default function CustomerPortfolio() {
  const { user } = useAuth()
  const { getCustomer } = useData()
  const customer = user?.customerId ? getCustomer(user.customerId) : undefined

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">Account setup in progress.</p>
        </div>
      </div>
    )
  }

  const portfolioValue = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
  const cost = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.avgBuyPrice), 0)
  const pnl = portfolioValue - cost

  const tx = [...customer.transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const stats = [
    { label: 'Current Value', value: inr(portfolioValue), icon: BarChart3, color: 'from-blue-500 to-cyan-400' },
    { label: 'Invested Cost', value: inr(cost), icon: Wallet, color: 'from-purple-500 to-pink-400' },
    { label: 'Total P&L', value: inrSigned(pnl), icon: TrendingUp, color: pnl >= 0 ? 'from-emerald-500 to-teal-400' : 'from-red-500 to-orange-400', highlight: true, positive: pnl >= 0 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Portfolio</h1>
                <p className="text-xs text-gray-400">Detailed holdings and transaction history</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </a>
              <a href="/dashboard/insurance" className="text-gray-400 hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
              </a>
              <a href="/dashboard/profile" className="text-gray-400 hover:text-white transition-colors">
                <Wallet className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeIn}>
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.highlight && (
                    <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                  )}
                </div>
                <div className={`text-2xl font-bold mb-1 ${stat.highlight ? (stat.positive ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Holdings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Holdings ({customer.holdings.length})</h2>
          </div>
          {customer.holdings.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No holdings deployed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Instrument</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Asset</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Qty</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Avg.</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Current</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Value</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {customer.holdings.map((h) => {
                    const hpnl = holdingPnl(h.quantity, h.avgBuyPrice, h.currentPrice)
                    const assetGradient = assetColor[h.assetClass] || 'from-gray-500 to-slate-400'
                    return (
                      <tr key={h.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="py-4">
                          <div className="font-medium text-white">{h.symbol}</div>
                          <div className="text-xs text-gray-500">{h.name}</div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${assetGradient} text-white`}>
                            {h.assetClass}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">{h.quantity}</td>
                        <td className="py-4 text-gray-300">{inr(h.avgBuyPrice)}</td>
                        <td className="py-4 text-gray-300">{inr(h.currentPrice)}</td>
                        <td className="py-4 font-medium text-white">{inr(holdingValue(h.quantity, h.currentPrice))}</td>
                        <td className={`py-4 font-medium ${hpnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pct(holdingPnlPct(h.avgBuyPrice, h.currentPrice))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Transaction History ({tx.length})</h2>
            <ArrowLeftRight className="w-5 h-5 text-gray-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Type</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Description</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {tx.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="py-3 text-gray-400">{formatDate(t.date)}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.amount >= 0 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{t.description}</td>
                    <td className={`py-3 text-right font-medium ${t.amount >= 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {inrSigned(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
