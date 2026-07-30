import DashboardShell from '../../components/DashboardShell'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/ui/StatCard'
import Badge, { statusColor } from '../../components/ui/Badge'
import { inr, timeAgo, holdingValue } from '../../lib/utils'
import { IconUsers, IconWallet, IconShield, IconTrend } from '../../components/icons'
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { Link } from 'react-router-dom'

const PIE_COLORS = ['#2563eb', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444']

export default function AdminDashboard() {
  const { customers, leads } = useData()

  const totalAUM = customers.reduce(
    (s, c) => s + c.holdings.reduce((a, h) => a + holdingValue(h.quantity, h.currentPrice), 0) + c.investedAmount * 0.1,
    0,
  )
  const activeCustomers = customers.filter((c) => c.status === 'Active').length
  const pendingKyc = customers.filter((c) => !c.kycVerified).length
  const insuranceLeads = leads.filter((l) => l.type === 'Insurance').length
  const investmentLeads = leads.filter((l) => l.type === 'Investment').length
  const newLeads = leads.filter((l) => l.status === 'New').length

  // plan distribution
  const planDist = ['Premium', 'Standard', 'Customised'].map((p) => ({
    name: p,
    value: customers.filter((c) => c.plan === p).length,
  }))

  // asset allocation
  const assetMap: Record<string, number> = {}
  customers.forEach((c) => c.holdings.forEach((h) => {
    assetMap[h.assetClass] = (assetMap[h.assetClass] || 0) + holdingValue(h.quantity, h.currentPrice)
  }))
  const assetDist = Object.entries(assetMap).map(([name, value]) => ({ name, value }))

  // monthly payouts (mock last 6 months trend)
  const monthlyData = [
    { month: 'Feb', payouts: customers.reduce((s, c) => s + c.monthlyPayout, 0) * 0.85 },
    { month: 'Mar', payouts: customers.reduce((s, c) => s + c.monthlyPayout, 0) * 0.9 },
    { month: 'Apr', payouts: customers.reduce((s, c) => s + c.monthlyPayout, 0) * 0.93 },
    { month: 'May', payouts: customers.reduce((s, c) => s + c.monthlyPayout, 0) * 0.97 },
    { month: 'Jun', payouts: customers.reduce((s, c) => s + c.monthlyPayout, 0) * 0.99 },
    { month: 'Jul', payouts: customers.reduce((s, c) => s + c.monthlyPayout, 0) },
  ]

  const recentLeads = [...leads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)

  return (
    <DashboardShell variant="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Overview of customers, assets under management and leads.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Customers" value={customers.length} accent="blue" icon={<IconUsers className="h-6 w-6" />} hint={`${activeCustomers} active · ${pendingKyc} KYC pending`} />
        <StatCard label="Assets Under Mgmt" value={inr(totalAUM, true)} accent="green" icon={<IconWallet className="h-6 w-6" />} hint="Investments + holdings" />
        <StatCard label="Insurance Leads" value={insuranceLeads} accent="teal" icon={<IconShield className="h-6 w-6" />} hint={`${newLeads} new`} />
        <StatCard label="Investment Leads" value={investmentLeads} accent="amber" icon={<IconTrend className="h-6 w-6" />} hint="From website forms" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4">Monthly Payouts Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Bar dataKey="payouts" name="Payouts" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={planDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {planDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={assetDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {assetDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={(v: number) => inr(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent leads */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Leads</h3>
            <div className="flex gap-2 text-xs">
              <Link to="/admin/investment-leads" className="text-brand-600">Investment →</Link>
              <Link to="/admin/insurance-leads" className="text-brand-600">Insurance →</Link>
            </div>
          </div>
          <div className="space-y-3">
            {recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                    {l.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.type} · {timeAgo(l.createdAt)}</p>
                  </div>
                </div>
                <Badge color={statusColor(l.status)}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
