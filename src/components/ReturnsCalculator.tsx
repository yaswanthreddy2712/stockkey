import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const PLAN_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b']
const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

function generateGrowthData(investment: number, monthlyReturn: number) {
  const data = []
  let total = investment
  for (let i = 0; i <= 12; i++) {
    data.push({
      month: i === 0 ? 'Start' : `Month ${i}`,
      invested: investment,
      value: Math.round(total),
      returns: Math.round(total - investment),
    })
    if (i > 0) total += monthlyReturn
  }
  return data
}

function generateMonthlyPayouts(monthlyReturn: number) {
  return Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    payout: monthlyReturn,
    cumulative: monthlyReturn * (i + 1),
  }))
}

const portfolioAllocation = [
  { name: 'Equities', value: 40, color: '#0ea5e9' },
  { name: 'Bonds', value: 25, color: '#10b981' },
  { name: 'ETFs', value: 20, color: '#f59e0b' },
  { name: 'IPOs', value: 10, color: '#8b5cf6' },
  { name: 'Options', value: 5, color: '#ef4444' },
]

const comparisonData = [
  { name: 'Year 1', stockKey: 144, fd: 7, mf: 12 },
  { name: 'Year 2', stockKey: 144, fd: 7, mf: 12 },
  { name: 'Year 3', stockKey: 144, fd: 7, mf: 12 },
]

const inr = (n: number) => `₹${(n / 100000).toFixed(1)}L`

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? `₹${(p.value / 100000).toFixed(2)}L` : p.value}{p.name === 'returns' || p.name === 'cumulative' ? '' : ''}
        </p>
      ))}
    </div>
  )
}

export default function ReturnsCalculator({ planIndex = 1 }: { planIndex?: number }) {
  const [selectedPlan, setSelectedPlan] = useState(planIndex)

  const plans = [
    { name: 'Premium', investment: 1000000, monthlyReturn: 120000 },
    { name: 'Standard', investment: 500000, monthlyReturn: 60000 },
    { name: 'Customised', investment: 100000, monthlyReturn: 12000 },
  ]

  const plan = plans[selectedPlan]
  const growthData = generateGrowthData(plan.investment, plan.monthlyReturn)
  const payoutData = generateMonthlyPayouts(plan.monthlyReturn)
  const totalReturn = plan.monthlyReturn * 12
  const roi = Math.round((totalReturn / plan.investment) * 100)

  return (
    <div className="space-y-10">
      {/* Plan Selector */}
      <div className="flex justify-center gap-3">
        {plans.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setSelectedPlan(i)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selectedPlan === i
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Investment', value: inr(plan.investment), color: 'text-ink-800' },
          { label: 'Monthly Return', value: `₹${(plan.monthlyReturn / 1000).toFixed(0)}K`, color: 'text-emerald-600' },
          { label: 'Total Returns', value: inr(totalReturn), color: 'text-sky-600' },
          { label: 'ROI', value: `${roi}%`, color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-ink-100 p-5 text-center">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold tabular ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="text-lg font-bold text-ink-800 font-display">Investment Growth Over 12 Months</h3>
        <p className="text-sm text-ink-500 mt-1">Your capital grows as monthly returns accumulate</p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#0ea5e9" fill="url(#colorValue)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="returns" name="Total Returns" stroke="#10b981" fill="url(#colorReturns)" strokeWidth={2} />
              <Area type="monotone" dataKey="invested" name="Invested" stroke="#d1d5db" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Payouts Chart */}
      <div className="bg-white rounded-2xl border border-ink-100 p-6">
        <h3 className="text-lg font-bold text-ink-800 font-display">Monthly Payout Schedule</h3>
        <p className="text-sm text-ink-500 mt-1">You receive ₹{(plan.monthlyReturn / 1000).toFixed(0)}K every month for 12 months</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="payout" name="Monthly Payout" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cumulative" name="Cumulative" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column: Pie + Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <div className="bg-white rounded-2xl border border-ink-100 p-6">
          <h3 className="text-lg font-bold text-ink-800 font-display">Portfolio Allocation</h3>
          <p className="text-sm text-ink-500 mt-1">Diversified across asset classes</p>
          <div className="mt-6 h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {portfolioAllocation.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-2xl border border-ink-100 p-6">
          <h3 className="text-lg font-bold text-ink-800 font-display">Returns Comparison</h3>
          <p className="text-sm text-ink-500 mt-1">Stock Key vs FD vs Mutual Funds</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} width={60} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend />
                <Bar dataKey="stockKey" name="Stock Key" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={18} />
                <Bar dataKey="mf" name="Mutual Fund" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={18} />
                <Bar dataKey="fd" name="Fixed Deposit" fill="#10b981" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
