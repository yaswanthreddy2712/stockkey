// Core domain types for Stock Key Investments

export type UserRole = 'admin' | 'customer'

export interface User {
  id: string
  name: string
  email: string
  password: string // NOTE: plaintext only because this is a client-side mock DB
  role: UserRole
  customerId?: string // link to Customer record (for role=customer)
  createdAt: string
}

export type InvestmentPlanTier = 'Premium' | 'Standard' | 'Customised'

export type AssetClass = 'Equity' | 'Bond' | 'ETF' | 'IPO' | 'Options'

export interface Holding {
  id: string
  symbol: string
  name: string
  assetClass: AssetClass
  quantity: number
  avgBuyPrice: number
  currentPrice: number
}

export interface Transaction {
  id: string
  date: string
  type: 'Buy' | 'Sell' | 'Dividend' | 'Payout' | 'Investment'
  description: string
  amount: number // positive credit, negative debit
}

export type PaymentMethod = 'UPI (GPay/PhonePe/Paytm)' | 'Bank Transfer / NEFT / RTGS' | 'Cheque' | 'Cash'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  aadhaar: string
  pan: string
  plan: InvestmentPlanTier
  investedAmount: number
  monthlyPayout: number
  joinDate: string
  status: 'Active' | 'Pending' | 'Inactive'
  kycVerified: boolean
  address: string
  dateOfBirth: string
  photo?: string
  holdings: Holding[]
  transactions: Transaction[]
  paymentMethod: PaymentMethod
  utrNumber: string
  referenceNo: string
}

export type InsuranceCategory = 'Health' | 'Term' | 'Car' | 'Bike'

export interface InsurancePlan {
  id: string
  category: InsuranceCategory
  insurer: string
  planName: string
  tagline: string
  basePremium: number // annual, in INR
  features: string[]
  rating: number // out of 5
  highlights: string[]
  cashless?: boolean
  claimSettlementRate?: number // percentage
}

export type LeadType = 'Investment' | 'Insurance' | 'Contact'

export type LeadStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed' | 'Lost'

export interface Lead {
  id: string
  type: LeadType
  name: string
  email: string
  phone: string
  // investment-specific
  plan?: InvestmentPlanTier
  investmentAmount?: number
  aadhaar?: string
  // insurance-specific
  insuranceCategory?: InsuranceCategory
  insurancePlanId?: string
  estimatedPremium?: number
  // contact-specific
  message?: string
  status: LeadStatus
  createdAt: string
  notes?: string
}

export interface StockPrice {
  symbol: string
  name: string
  price: number
  change: number // percent
  sector: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}
