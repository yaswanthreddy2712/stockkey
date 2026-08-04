import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, TrendingUp, Wallet, BarChart3, Shield, ArrowUpRight, ArrowDownRight, Clock, ChevronRight } from 'lucide-react'
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

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const { getCustomer } = useData()
  const customer = user?.customerId ? getCustomer(user.customerId) : undefined

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">Your account is being set up. Please check back shortly.</p>
        </div>
      </div>
    )
  }

  const portfolioValue = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.currentPrice), 0)
  const investedInMarket = customer.holdings.reduce((s, h) => s + holdingValue(h.quantity, h.avgBuyPrice), 0)
  const totalPnl = portfolioValue - investedInMarket
  const totalPnlPct = investedInMarket ? (totalPnl / investedInMarket) * 100 : 0
  const totalReturns = customer.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const recentTx = [...customer.transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5)

  const stats = [
    { label: 'Portfolio Value', value: inr(portfolioValue, true), icon: BarChart3, color: 'from-blue-500 to-cyan-400', hint: `${customer.holdings.length} holdings`, up: totalPnl >= 0 },
    { label: 'Total Returns', value: inr(totalReturns, true), icon: TrendingUp, color: 'from-emerald-500 to-teal-400', hint: 'Payouts + dividends', up: true },
    { label: 'Unrealized P&L', value: inrSigned(totalPnl), icon: Wallet, color: totalPnl >= 0 ? 'from-emerald-500 to-teal-400' : 'from-red-500 to-orange-400', hint: pct(totalPnlPct), up: totalPnl >= 0 },
    { label: 'Monthly Payout', value: inr(customer.monthlyPayout), icon: Shield, color: 'from-amber-500 to-orange-400', hint: `Invested ${inr(customer.investedAmount, true)}`, up: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                <p className="text-xs text-gray-400">Welcome back, {customer.name.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/portfolio" className="text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </Link>
              <Link to="/dashboard/insurance" className="text-gray-400 hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
              </Link>
              <Link to="/dashboard/profile" className="text-gray-400 hover:text-white transition-colors">
                <Wallet className="w-5 h-5" />
              </Link>
              <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2"
        >
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            customer.status === 'Active' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${customer.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {customer.status} • {customer.plan} Plan
          </span>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeIn} className="group">
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.hint}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
              <Link to="/dashboard/portfolio" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {customer.holdings.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No holdings yet. Your portfolio will appear here once your investment is deployed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/50">
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Symbol</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Qty</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Current</th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {customer.holdings.slice(0, 5).map((h) => {
                      const pnl = holdingPnl(h.quantity, h.avgBuyPrice, h.currentPrice)
                      return (
                        <tr key={h.id} className="hover:bg-gray-800/20 transition-colors">
                          <td className="py-3">
                            <div className="font-medium text-white">{h.symbol}</div>
                            <div className="text-xs text-gray-500">{h.assetClass}</div>
                          </td>
                          <td className="py-3 text-gray-300">{h.quantity}</td>
                          <td className="py-3 text-gray-300">{inr(h.currentPrice)}</td>
                          <td className={`py-3 font-medium ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Plan Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">{customer.plan} Plan</div>
                  <div className="text-2xl font-bold text-white">{inr(customer.monthlyPayout)}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <span className="text-sm text-gray-400">Invested</span>
                  <span className="font-medium text-white">{inr(customer.investedAmount, true)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <span className="text-sm text-gray-400">KYC</span>
                  <span className={`font-medium ${customer.kycVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {customer.kycVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                {customer.utrNumber && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-sm text-gray-400">Payment</span>
                      <span className="text-white text-xs">{customer.paymentMethod || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-sm text-gray-400">UTR No.</span>
                      <span className="font-medium text-white text-xs">{customer.utrNumber}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <Clock className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-3">
                {recentTx.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{t.type}</p>
                      <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                    </div>
                    <span className={`font-medium ${t.amount >= 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {inrSigned(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
