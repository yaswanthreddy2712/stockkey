const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ ok: boolean; user?: any; error?: string }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  register: (data: { name: string; email: string; password: string; phone: string; aadhaar: string; pan: string; plan: string; paymentMethod: string; utrNumber: string; referenceNo: string }) =>
    request<{ ok: boolean; user?: any; error?: string }>('/auth/register', {
      method: 'POST', body: JSON.stringify(data),
    }),
  getSession: (userId: string) =>
    request<{ ok: boolean; user: any }>(`/auth/session/${userId}`),

  // Customers
  getCustomers: () => request<any[]>('/customers'),
  getCustomer: (id: string) => request<any>(`/customers/${id}`),
  addCustomer: (data: any) => request<any>('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) => request<any>(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) => request<any>(`/customers/${id}`, { method: 'DELETE' }),

  // Leads
  getLeads: () => request<any[]>('/leads'),
  addLead: (data: any) => request<any>('/leads', { method: 'POST', body: JSON.stringify(data) }),
  updateLead: (id: string, data: any) => request<any>(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLead: (id: string) => request<any>(`/leads/${id}`, { method: 'DELETE' }),

  // Messages
  getMessages: () => request<any[]>('/messages'),
  addMessage: (data: any) => request<any>('/messages', { method: 'POST', body: JSON.stringify(data) }),

  // Reference data
  getInsurancePlans: () => request<any[]>('/insurance-plans'),
  getStocks: () => request<any[]>('/stocks'),

  // Email
  sendEmail: (to: string, template: string, data?: Record<string, any>) =>
    request<{ ok: boolean; message?: string; error?: string }>('/email/send', {
      method: 'POST', body: JSON.stringify({ to, template, data }),
    }),
  broadcastEmail: (subject: string, body: string, audience: string) =>
    request<{ ok: boolean; sent: number; failed: number; total: number; error?: string }>('/email/broadcast', {
      method: 'POST', body: JSON.stringify({ subject, body, audience }),
    }),
  checkEmailConfig: () => request<{ configured: boolean; host: string | null; user: string | null }>('/email/check-config'),
}
