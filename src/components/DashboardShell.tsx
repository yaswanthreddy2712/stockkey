import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconDashboard, IconChart, IconUsers, IconShield, IconLogout, IconUser, IconWallet, IconBriefcase } from './icons'

interface NavItem { to: string; label: string; icon: (p: { className?: string }) => ReactNode; end?: boolean }

const customerNav: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: IconDashboard, end: true },
  { to: '/dashboard/portfolio', label: 'My Portfolio', icon: IconChart },
  { to: '/dashboard/profile', label: 'Profile & KYC', icon: IconUser },
]

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/admin/customers', label: 'Customers', icon: IconUsers },
  { to: '/admin/portfolios', label: 'Portfolios', icon: IconChart },
  { to: '/admin/insurance-leads', label: 'Insurance Leads', icon: IconShield },
  { to: '/admin/investment-leads', label: 'Investment Leads', icon: IconBriefcase },
]

interface ShellProps {
  variant: 'customer' | 'admin'
  children: ReactNode
}

export default function DashboardShell({ variant, children }: ShellProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = variant === 'admin' ? adminNav : customerNav
  const accent = variant === 'admin' ? 'text-brand-600' : 'text-accent-600'

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive ? `bg-brand-50 ${accent}` : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen lg:fixed lg:top-0 lg:left-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white"><IconWallet className="h-4 w-4" /></span>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-slate-800">Stock Key</span>
              <span className={`block text-[11px] font-medium ${accent}`}>{variant === 'admin' ? 'Admin Panel' : 'Investor Portal'}</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-x-auto lg:overflow-x-visible flex lg:flex-col gap-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
              <n.icon className="h-5 w-5 shrink-0" /> <span className="whitespace-nowrap">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 hidden lg:block">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-600" title="Logout"><IconLogout className="h-5 w-5" /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  )
}
