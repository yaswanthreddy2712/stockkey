import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Customer, Lead, InsurancePlan, StockPrice, ContactMessage } from '../types'
import { api } from '../lib/api'

interface DataContextValue {
  customers: Customer[]
  leads: Lead[]
  insurancePlans: InsurancePlan[]
  stocks: StockPrice[]
  messages: ContactMessage[]

  getCustomer: (id: string) => Customer | undefined
  addCustomer: (c: Omit<Customer, 'id'>) => Promise<Customer>
  updateCustomer: (id: string, patch: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  addLead: (l: Omit<Lead, 'id' | 'createdAt' | 'status'> & Partial<Pick<Lead, 'status'>>) => Lead
  updateLead: (id: string, patch: Partial<Lead>) => void
  deleteLead: (id: string) => void

  addMessage: (m: Omit<ContactMessage, 'id' | 'createdAt'>) => void

  resetDB: () => void
  loading: boolean
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([])
  const [stocks, setStocks] = useState<StockPrice[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  // Load all data on mount
  useEffect(() => {
    async function load() {
      try {
        const [c, l, ip, s, m] = await Promise.all([
          api.getCustomers(),
          api.getLeads(),
          api.getInsurancePlans(),
          api.getStocks(),
          api.getMessages(),
        ])
        setCustomers(c)
        setLeads(l)
        setInsurancePlans(ip)
        setStocks(s)
        setMessages(m)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getCustomer = (id: string) => customers.find((c) => c.id === id)

  const addCustomer = async (c: Omit<Customer, 'id'>): Promise<Customer> => {
    try {
      const created = await api.addCustomer(c)
      setCustomers((prev) => [created, ...prev])
      return created
    } catch (err) {
      console.error('Failed to add customer:', err)
      throw err
    }
  }

  const updateCustomer = async (id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    try {
      const updated = await api.updateCustomer(id, patch)
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch (err) {
      console.error('Failed to update customer:', err)
    }
  }

  const deleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    try {
      await api.deleteCustomer(id)
    } catch (err) {
      console.error('Failed to delete customer:', err)
    }
  }

  const addLead = (l: Omit<Lead, 'id' | 'createdAt' | 'status'> & Partial<Pick<Lead, 'status'>>): Lead => {
    const temp: any = { ...l, id: `temp_${Date.now()}`, createdAt: new Date().toISOString(), status: l.status || 'New' }
    // Fire and forget — add optimistically then reconcile
    api.addLead(l).then((created) => {
      setLeads((prev) => [created, ...prev.filter((x) => x.id !== temp.id)])
    }).catch(console.error)
    return temp
  }

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
    try {
      const updated = await api.updateLead(id, patch)
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    } catch (err) {
      console.error('Failed to update lead:', err)
    }
  }

  const deleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
    try {
      await api.deleteLead(id)
    } catch (err) {
      console.error('Failed to delete lead:', err)
    }
  }

  const addMessage = async (m: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    try {
      const created = await api.addMessage(m)
      setMessages((prev) => [created, ...prev])
    } catch (err) {
      console.error('Failed to add message:', err)
    }
  }

  const resetDB = () => {
    // Reset is handled via server seed endpoint
    console.warn('Reset via server: run npm run seed in /server')
  }

  const value: DataContextValue = {
    customers, leads, insurancePlans, stocks, messages,
    getCustomer, addCustomer, updateCustomer, deleteCustomer,
    addLead, updateLead, deleteLead,
    addMessage, resetDB, loading,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
