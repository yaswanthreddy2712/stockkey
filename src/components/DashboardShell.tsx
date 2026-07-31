import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconDashboard, IconChart, IconUsers, IconShield, IconLogout, IconUser, IconWallet, IconBriefcase } from './icons'

interface NavItem { to: string; label: string; icon: (p: { className?: string }) => ReactNode; end?: boolean }

const customerNav: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: IconDashboard, end: true },
  { to: '/dashboard/portfolio', label: 'My Portfolio', icon: IconChart },
  { to: '/dashboard/insurance', label: 'Insurance', icon: IconShield },
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

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-gold-400 bg-gold-500/10 border-l-2 border-gold-500'
        : 'text-ink-400 hover:text-gold-400 hover:bg-white/[0.04]'
    }`

  return (
    <div className="min-h-screen bg-[#F7F8FB] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-[260px] lg:min-h-screen lg:fixed lg:top-0 lg:left-0 bg-ink-950 flex flex-col border-r border-white/[0.06]">
        {/* Thin gold accent line at top */}
        <div className="h-[2px] bg-gold-gradient" />

        {/* Logo area */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500/15 text-gold-400">
              <IconWallet className="h-[18px] w-[18px]" />
            </span>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-white font-display">Stock Key</span>
              <span className="block text-[11px] font-medium text-gold-400">
                {variant === 'admin' ? 'Admin Panel' : 'Investor Portal'}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-x-auto lg:overflow-x-visible flex lg:flex-col gap-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
              <n.icon className="h-5 w-5 shrink-0 text-current" />
              <span className="whitespace-nowrap">{n.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile section at bottom */}
        <div className="hidden lg:block border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/20 text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-ink-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-ink-400 hover:text-red-400 transition-colors duration-200"
              title="Logout"
            >
              <IconLogout className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-[260px]">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  )
}
