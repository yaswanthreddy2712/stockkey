import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconMenu, IconX, IconChart, IconUser, IconLogout, IconDashboard, IconShield, IconTrend, IconHeart, IconCar } from './icons'

const navItems = [
  { to: '/', label: 'Home', icon: IconChart, iconBg: 'from-gold-400 to-gold-600' },
  { to: '/about', label: 'About', icon: IconShield, iconBg: 'from-blue-400 to-blue-600' },
  { to: '/plans', label: 'Plans', icon: IconTrend, iconBg: 'from-emerald-400 to-emerald-600' },
  { to: '/insurance', label: 'Insurance', icon: IconHeart, iconBg: 'from-pink-400 to-pink-600' },
  { to: '/contact', label: 'Contact', icon: IconCar, iconBg: 'from-violet-400 to-violet-600' },
]

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); setOpen(false); navigate('/') }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-700/50' : 'bg-transparent'}`}>
      <nav className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 max-w-[88rem] mx-auto min-h-[3.5rem]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-gradient text-white shadow-lg group-hover:scale-105 transition-transform">
            <IconChart className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold text-white font-display tracking-tight">Stock Key</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center justify-center gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-item-3d inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'text-sky-300' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`nav-icon-3d bg-gradient-to-br ${item.iconBg} ${isActive ? 'text-white shadow-[0_0_0_2px_rgba(240,215,140,0.4)]' : 'text-ink-900'}`}>
                    <item.icon className="h-3 w-3" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right: auth */}
        <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-sky-100 bg-sky-gradient-soft border border-sky-400/30 hover:bg-sky-400/20 transition-all"
              >
                {isAdmin ? <IconDashboard className="h-3.5 w-3.5" /> : <IconUser className="h-3.5 w-3.5" />}
                {isAdmin ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gold-500/15 text-gold-400 text-xs font-bold ring-1 ring-gold-500/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="p-1.5 text-white/40 hover:text-red-400 transition-colors" title="Logout">
                  <IconLogout className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="inline-flex items-center rounded-full overflow-hidden border border-sky-400/35 bg-sky-gradient-soft shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
              <Link to="/login" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-700/50 transition-colors">
                <IconUser className="h-3.5 w-3.5" /> Login
              </Link>
              <span className="text-gray-500 text-xs">/</span>
              <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-gradient text-white hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="xl:hidden p-2 text-white/70 hover:text-white border border-white/20 bg-white/[0.08] rounded-xl backdrop-blur-lg transition-all" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <IconX /> : <IconMenu />}
          <span className="sr-only ml-1 text-xs font-semibold uppercase tracking-wider hidden sm:inline">Menu</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50">
          <div className="section py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive ? 'text-sky-300 bg-sky-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`
                }
              >
                <span className={`nav-icon-3d bg-gradient-to-br ${item.iconBg} text-ink-900`}>
                  <item.icon className="h-3 w-3" />
                </span>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-gold w-full" onClick={() => setOpen(false)}>
                    {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="btn-outline w-full">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline w-full" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-gold w-full" onClick={() => setOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
