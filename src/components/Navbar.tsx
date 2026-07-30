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
    `px-3 py-2 text-sm font-medium rounded-md transition ${
      isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
    }`

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="section flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-white">
            <IconChart className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-slate-800">Stock Key</span>
            <span className="block text-[11px] font-medium text-brand-600 -mt-0.5">Investments</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {publicLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-outline">
                {isAdmin ? <IconDashboard className="h-4 w-4" /> : <IconUser className="h-4 w-4" />}
                {isAdmin ? 'Admin Panel' : 'My Dashboard'}
              </Link>
              <div className="flex items-center gap-2 px-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="btn-ghost" title="Logout">
                  <IconLogout className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Start Investing</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-slate-600" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <IconX /> : <IconMenu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="section py-3 flex flex-col gap-1">
            {publicLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-primary w-full" onClick={() => setOpen(false)}>
                    {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="btn-outline w-full">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline w-full" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary w-full" onClick={() => setOpen(false)}>Start Investing</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
