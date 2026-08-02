import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { api } from '../lib/api'

const SESSION_KEY = 'ski_session_v1'

interface RegisterInput {
  name: string
  email: string
  password: string
  phone: string
  aadhaar: string
  pan: string
  plan: 'Premium' | 'Standard' | 'Customised'
  paymentMethod: string
  utrNumber: string
  referenceNo: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: User }>
  loginWithOTP: (email: string, otp: string) => Promise<{ ok: boolean; error?: string; user?: User }>
  sendOTP: (email: string) => Promise<{ ok: boolean; error?: string; message?: string }>
  sendRegisterOTP: (email: string) => Promise<{ ok: boolean; error?: string; message?: string }>
  verifyRegisterOTP: (email: string, otp: string) => Promise<{ ok: boolean; error?: string; message?: string }>
  logout: () => void
  register: (input: RegisterInput) => Promise<{ ok: boolean; error?: string; user?: User }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadSessionUserId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const userId = loadSessionUserId()
    if (!userId) { setHydrated(true); return }
    api.getSession(userId)
      .then((res) => {
        if (res.ok) setUser(res.user as User)
        else localStorage.removeItem(SESSION_KEY)
      })
      .catch(() => localStorage.removeItem(SESSION_KEY))
      .finally(() => setHydrated(true))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password)
      if (res.ok && res.user) {
        localStorage.setItem(SESSION_KEY, res.user.id)
        setUser(res.user)
        return { ok: true, user: res.user }
      }
      return { ok: false, error: res.error }
    } catch {
      return { ok: false, error: 'Network error. Is the server running?' }
    }
  }

  const sendOTP = async (email: string) => {
    try {
      const res = await api.sendOTP(email)
      return { ok: res.ok, error: res.error, message: res.message }
    } catch {
      return { ok: false, error: 'Network error. Is the server running?' }
    }
  }

  const sendRegisterOTP = async (email: string) => {
    try {
      const res = await api.sendRegisterOTP(email)
      return { ok: res.ok, error: res.error, message: res.message }
    } catch {
      return { ok: false, error: 'Network error. Is the server running?' }
    }
  }

  const verifyRegisterOTP = async (email: string, otp: string) => {
    try {
      const res = await api.verifyRegisterOTP(email, otp)
      return { ok: res.ok, error: res.error, message: res.message }
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Network error. Is the server running?' }
    }
  }

  const loginWithOTP = async (email: string, otp: string) => {
    try {
      const res = await api.verifyOTP(email, otp)
      if (res.ok && res.user) {
        localStorage.setItem(SESSION_KEY, res.user.id)
        setUser(res.user)
        return { ok: true, user: res.user }
      }
      return { ok: false, error: res.error }
    } catch {
      return { ok: false, error: 'Network error. Is the server running?' }
    }
  }

  const register = async (input: RegisterInput) => {
    try {
      const res = await api.register(input)
      if (res.ok && res.user) {
        localStorage.setItem(SESSION_KEY, res.user.id)
        setUser(res.user)
        return { ok: true, user: res.user }
      }
      return { ok: false, error: res.error }
    } catch {
      return { ok: false, error: 'Network error. Is the server running?' }
    }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    loginWithOTP,
    sendOTP,
    sendRegisterOTP,
    verifyRegisterOTP,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
