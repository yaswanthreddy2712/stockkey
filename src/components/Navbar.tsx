import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconMenu, IconX, IconChart, IconUser, IconLogout, IconDashboard } from './icons'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/plans', label: 'Investment Plans' },
  { to: '/insurance', label: 'Insurance' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-gold-400'
        : 'text-ink-300 hover:text-gold-400'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl">
      <nav className="section flex h-[68px] items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/20">
            <IconChart className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-white font-display">Stock Key</span>
            <span className="block text-[11px] font-semibold text-gold-400 -mt-0.5">Investments</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {publicLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-px left-3 right-3 h-[2px] rounded-full bg-gold-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="btn-outline-gold btn-sm"
              >
                {isAdmin ? <IconDashboard className="h-4 w-4" /> : <IconUser className="h-4 w-4" />}
                {isAdmin ? 'Admin Panel' : 'My Dashboard'}
              </Link>
              <div className="flex items-center gap-2.5 px-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gold-500/15 text-gold-400 text-xs font-bold ring-1 ring-gold-500/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-ink-300">{user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-ghost text-ink-400 hover:text-red-400 p-1.5" title="Logout">
                  <IconLogout className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline-gold">Login</Link>
              <Link to="/register" className="btn-gold">Start Investing</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-ink-300 hover:text-gold-400" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <IconX /> : <IconMenu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.06] bg-ink-900/95 backdrop-blur-xl">
          <div className="section py-4 flex flex-col gap-1">
            {publicLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-ink-300 hover:text-gold-400 hover:bg-white/[0.04]'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-gold w-full" onClick={() => setOpen(false)}>
                    {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="btn-outline-gold w-full">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline-gold w-full" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-gold w-full" onClick={() => setOpen(false)}>Start Investing</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
