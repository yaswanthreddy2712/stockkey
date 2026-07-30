import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Customer from './models/Customer.js'
import Lead from './models/Lead.js'
import InsurancePlan from './models/InsurancePlan.js'
import StockPrice from './models/StockPrice.js'

const now = new Date()
const iso = (daysAgo) => new Date(now.getTime() - daysAgo * 86400000).toISOString()
const uid = (p, i) => `${p}_${String(i).padStart(3, '0')}`
const nid = () => `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const users = [
  { _id: 'user_admin', name: 'Rajesh Kumar', email: 'admin@stockkey.in', password: 'admin123', role: 'admin', createdAt: iso(400) },
  { _id: 'user_customer_001', name: 'Suresh Patel', email: 'customer@stockkey.in', password: 'customer123', role: 'customer', customerId: 'cust_001', createdAt: iso(220) },
  { _id: 'user_customer_002', name: 'Anita Sharma', email: 'anita@example.com', password: 'customer123', role: 'customer', customerId: 'cust_002', createdAt: iso(150) },
]

const stocks = [
  { _id: 'RELIANCE', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.6, change: 1.24, sector: 'Energy' },
  { _id: 'TCS', symbol: 'TCS', name: 'Tata Consultancy Services', price: 3890.25, change: 0.82, sector: 'IT' },
  { _id: 'INFY', symbol: 'INFY', name: 'Infosys', price: 1612.4, change: -0.45, sector: 'IT' },
  { _id: 'HDFCBANK', symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1689.75, change: 0.66, sector: 'Banking' },
  { _id: 'ICICIBANK', symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1124.3, change: 1.88, sector: 'Banking' },
  { _id: 'HINDUNILVR', symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2456.9, change: -0.32, sector: 'FMCG' },
  { _id: 'SBIN', symbol: 'SBIN', name: 'State Bank of India', price: 812.55, change: 2.14, sector: 'Banking' },
  { _id: 'BHARTIARTL', symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1567.2, change: 0.97, sector: 'Telecom' },
  { _id: 'ITC', symbol: 'ITC', name: 'ITC Limited', price: 432.8, change: -0.18, sector: 'FMCG' },
  { _id: 'NIFTYBEES', symbol: 'NIFTYBEES', name: 'Nippon India Nifty ETF', price: 268.4, change: 0.74, sector: 'ETF' },
  { _id: 'GOLDBEES', symbol: 'GOLDBEES', name: 'Nippon India Gold ETF', price: 62.15, change: 0.41, sector: 'ETF' },
  { _id: 'TATAIPO', symbol: 'TATAIPO', name: 'Tata Technologies IPO', price: 1180.0, change: 3.22, sector: 'IPO' },
]

const customers = [
  {
    _id: 'cust_001', name: 'Suresh Patel', email: 'customer@stockkey.in', phone: '+91 98765 43210',
    aadhaar: 'XXXX-XXXX-4321', pan: 'ABCPK1234K', plan: 'Premium', investedAmount: 1000000, monthlyPayout: 40000,
    joinDate: iso(220), status: 'Active', kycVerified: true, address: '12 Marine Drive, Mumbai, Maharashtra 400020',
    dateOfBirth: '1985-04-12',
    holdings: [
      { _id: uid('h', 1), symbol: 'RELIANCE', name: 'Reliance Industries', assetClass: 'Equity', quantity: 120, avgBuyPrice: 2650, currentPrice: 2945.6 },
      { _id: uid('h', 2), symbol: 'HDFCBANK', name: 'HDFC Bank', assetClass: 'Equity', quantity: 200, avgBuyPrice: 1520, currentPrice: 1689.75 },
      { _id: uid('h', 3), symbol: 'NIFTYBEES', name: 'Nippon India Nifty ETF', assetClass: 'ETF', quantity: 1500, avgBuyPrice: 240, currentPrice: 268.4 },
      { _id: uid('h', 4), symbol: 'GOLDBEES', name: 'Nippon India Gold ETF', assetClass: 'ETF', quantity: 2000, avgBuyPrice: 55, currentPrice: 62.15 },
    ],
    transactions: [
      { _id: uid('t', 1), date: iso(220), type: 'Investment', description: 'Initial investment — Premium Plan', amount: -1000000 },
      { _id: uid('t', 2), date: iso(210), type: 'Payout', description: 'Monthly return payout', amount: 40000 },
      { _id: uid('t', 3), date: iso(180), type: 'Payout', description: 'Monthly return payout', amount: 40000 },
      { _id: uid('t', 4), date: iso(150), type: 'Payout', description: 'Monthly return payout', amount: 40000 },
      { _id: uid('t', 5), date: iso(120), type: 'Payout', description: 'Monthly return payout', amount: 40000 },
      { _id: uid('t', 6), date: iso(90), type: 'Dividend', description: 'Dividend — HDFC Bank', amount: 3200 },
    ],
  },
  {
    _id: 'cust_002', name: 'Anita Sharma', email: 'anita@example.com', phone: '+91 99887 76655',
    aadhaar: 'XXXX-XXXX-7654', pan: 'BDSAS5678L', plan: 'Standard', investedAmount: 500000, monthlyPayout: 20000,
    joinDate: iso(150), status: 'Active', kycVerified: true, address: '45 Brigade Road, Bengaluru, Karnataka 560001',
    dateOfBirth: '1990-09-23',
    holdings: [
      { _id: uid('h', 5), symbol: 'TCS', name: 'Tata Consultancy Services', assetClass: 'Equity', quantity: 60, avgBuyPrice: 3520, currentPrice: 3890.25 },
      { _id: uid('h', 6), symbol: 'INFY', name: 'Infosys', assetClass: 'Equity', quantity: 100, avgBuyPrice: 1500, currentPrice: 1612.4 },
      { _id: uid('h', 7), symbol: 'ICICIBANK', name: 'ICICI Bank', assetClass: 'Equity', quantity: 150, avgBuyPrice: 980, currentPrice: 1124.3 },
    ],
    transactions: [
      { _id: uid('t', 7), date: iso(150), type: 'Investment', description: 'Initial investment — Standard Plan', amount: -500000 },
      { _id: uid('t', 8), date: iso(140), type: 'Payout', description: 'Monthly return payout', amount: 20000 },
      { _id: uid('t', 9), date: iso(110), type: 'Payout', description: 'Monthly return payout', amount: 20000 },
      { _id: uid('t', 10), date: iso(80), type: 'Payout', description: 'Monthly return payout', amount: 20000 },
    ],
  },
  {
    _id: 'cust_003', name: 'Vikram Reddy', email: 'vikram@example.com', phone: '+91 90909 80808',
    aadhaar: 'XXXX-XXXX-1122', pan: 'CMKVR3344M', plan: 'Premium', investedAmount: 1000000, monthlyPayout: 40000,
    joinDate: iso(95), status: 'Active', kycVerified: true, address: '8 Banjara Hills, Hyderabad, Telangana 500034',
    dateOfBirth: '1982-12-05',
    holdings: [
      { _id: uid('h', 8), symbol: 'SBIN', name: 'State Bank of India', assetClass: 'Equity', quantity: 400, avgBuyPrice: 720, currentPrice: 812.55 },
      { _id: uid('h', 9), symbol: 'BHARTIARTL', name: 'Bharti Airtel', assetClass: 'Equity', quantity: 250, avgBuyPrice: 1380, currentPrice: 1567.2 },
      { _id: uid('h', 10), symbol: 'NIFTYBEES', name: 'Nippon India Nifty ETF', assetClass: 'ETF', quantity: 1200, avgBuyPrice: 235, currentPrice: 268.4 },
    ],
    transactions: [
      { _id: uid('t', 11), date: iso(95), type: 'Investment', description: 'Initial investment — Premium Plan', amount: -1000000 },
      { _id: uid('t', 12), date: iso(85), type: 'Payout', description: 'Monthly return payout', amount: 40000 },
      { _id: uid('t', 13), date: iso(55), type: 'Payout', description: 'Monthly return payout', amount: 40000 },
    ],
  },
  {
    _id: 'cust_004', name: 'Priya Nair', email: 'priya@example.com', phone: '+91 91234 56780',
    aadhaar: 'XXXX-XXXX-9988', pan: 'DLPNN9090N', plan: 'Customised', investedAmount: 250000, monthlyPayout: 10000,
    joinDate: iso(60), status: 'Active', kycVerified: false, address: '23 MG Road, Kochi, Kerala 682035',
    dateOfBirth: '1993-02-18',
    holdings: [
      { _id: uid('h', 11), symbol: 'ITC', name: 'ITC Limited', assetClass: 'Equity', quantity: 300, avgBuyPrice: 405, currentPrice: 432.8 },
      { _id: uid('h', 12), symbol: 'TATAIPO', name: 'Tata Technologies IPO', assetClass: 'IPO', quantity: 50, avgBuyPrice: 1050, currentPrice: 1180.0 },
    ],
    transactions: [
      { _id: uid('t', 14), date: iso(60), type: 'Investment', description: 'Initial investment — Customised Plan', amount: -250000 },
      { _id: uid('t', 15), date: iso(50), type: 'Payout', description: 'Monthly return payout', amount: 10000 },
    ],
  },
  {
    _id: 'cust_005', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 93456 12378',
    aadhaar: 'XXXX-XXXX-5544', pan: 'EMAJM4455P', plan: 'Standard', investedAmount: 500000, monthlyPayout: 20000,
    joinDate: iso(40), status: 'Pending', kycVerified: false, address: '67 Satya Niketan, New Delhi 110021',
    dateOfBirth: '1988-07-30', holdings: [],
    transactions: [
      { _id: uid('t', 16), date: iso(40), type: 'Investment', description: 'Initial investment — Standard Plan (pending clearance)', amount: -500000 },
    ],
  },
  {
    _id: 'cust_006', name: 'Deepa Iyer', email: 'deepa@example.com', phone: '+91 94567 89012',
    aadhaar: 'XXXX-XXXX-3322', pan: 'FNDII7788Q', plan: 'Customised', investedAmount: 1500000, monthlyPayout: 60000,
    joinDate: iso(180), status: 'Active', kycVerified: true, address: '14 Anna Salai, Chennai, Tamil Nadu 600002',
    dateOfBirth: '1979-11-11',
    holdings: [
      { _id: uid('h', 13), symbol: 'RELIANCE', name: 'Reliance Industries', assetClass: 'Equity', quantity: 200, avgBuyPrice: 2500, currentPrice: 2945.6 },
      { _id: uid('h', 14), symbol: 'HINDUNILVR', name: 'Hindustan Unilever', assetClass: 'Equity', quantity: 180, avgBuyPrice: 2280, currentPrice: 2456.9 },
      { _id: uid('h', 15), symbol: 'GOLDBEES', name: 'Nippon India Gold ETF', assetClass: 'ETF', quantity: 3000, avgBuyPrice: 50, currentPrice: 62.15 },
    ],
    transactions: [
      { _id: uid('t', 17), date: iso(180), type: 'Investment', description: 'Initial investment — Customised Plan', amount: -1500000 },
      { _id: uid('t', 18), date: iso(170), type: 'Payout', description: 'Monthly return payout', amount: 60000 },
      { _id: uid('t', 19), date: iso(140), type: 'Payout', description: 'Monthly return payout', amount: 60000 },
    ],
  },
]

const insurancePlans = [
  { _id: 'ins_h_1', category: 'Health', insurer: 'Star Health', planName: 'Family Health Optima', tagline: 'Comprehensive cover for your whole family', basePremium: 18500, rating: 4.4, cashless: true, claimSettlementRate: 89, features: ['₹10 Lakh sum insured', 'Cashless at 11,000+ hospitals', 'Pre & post hospitalisation', 'No room rent capping', 'Free annual health check-up'], highlights: ['Family floater', 'Restoration benefit', 'Maternity cover'] },
  { _id: 'ins_h_2', category: 'Health', insurer: 'HDFC ERGO', planName: 'Optima Secure', tagline: 'Secure your health with 2x coverage', basePremium: 24000, rating: 4.6, cashless: true, claimSettlementRate: 92, features: ['₹10 Lakh sum insured (2x secure)', 'Cashless at 10,000+ hospitals', 'No sub-limits', 'Air ambulance cover', 'Worldwide cover'], highlights: ['Instant 2x cover', 'No room rent limit', 'Protect plus'] },
  { _id: 'ins_h_3', category: 'Health', insurer: 'Niva Bupa', planName: 'ReAssure 2.0', tagline: 'Lifetime renewable health protection', basePremium: 21000, rating: 4.3, cashless: true, claimSettlementRate: 88, features: ['₹10 Lakh sum insured', 'Lock the price for 3 years', 'ReAssure benefit (reinstatement)', 'Mental wellness cover', 'Road ambulance'], highlights: ['Price lock', 'Reassure benefit', 'Mental health'] },
  { _id: 'ins_t_1', category: 'Term', insurer: 'LIC', planName: 'Tech Term Plan', tagline: 'Pure protection at affordable premiums', basePremium: 14000, rating: 4.5, claimSettlementRate: 98, features: ['₹1 Crore life cover', 'Policy term up to 40 years', 'Accidental death benefit', 'Critical illness rider option', 'Tax benefits u/s 80C'], highlights: ['₹1 Cr cover', '98% claim rate', 'Flexible payout'] },
  { _id: 'ins_t_2', category: 'Term', insurer: 'Max Life', planName: 'Smart Secure Plus', tagline: 'Comprehensive term coverage with return of premium', basePremium: 17500, rating: 4.6, claimSettlementRate: 99, features: ['₹1 Crore life cover', 'Return of premium option', 'Critical illness cover up to ₹50L', 'Waiver of premium on disability', 'Joint life option'], highlights: ['99% claim rate', 'Return of premium', 'Critical illness'] },
  { _id: 'ins_t_3', category: 'Term', insurer: 'HDFC Life', planName: 'Click 2 Protect Super', tagline: 'Flexible term insurance online', basePremium: 12800, rating: 4.4, claimSettlementRate: 97, features: ['₹1 Crore life cover', '4 plan options', 'Life stage protection', 'Top-up cover benefit', 'Instant online issuance'], highlights: ['Lowest premium', '4 options', 'Online instant'] },
  { _id: 'ins_c_1', category: 'Car', insurer: 'Acko', planName: 'Car Comprehensive', tagline: 'Cashless repairs, zero deductions', basePremium: 6500, rating: 4.5, cashless: true, claimSettlementRate: 90, features: ['Zero depreciation cover', 'Cashless claims at 1,000+ workshops', 'Engine protect add-on', 'Roadside assistance', '1-year / 3-year policy'], highlights: ['Zero dep', 'Fast claims', 'Add-ons available'] },
  { _id: 'ins_c_2', category: 'Car', insurer: 'Bajaj Allianz', planName: 'Car Shield', tagline: 'Complete car protection with perks', basePremium: 7200, rating: 4.4, cashless: true, claimSettlementRate: 91, features: ['Comprehensive own + third-party', 'Key replacement cover', 'Tyre secure', 'Personal accident cover ₹15L', 'No claim bonus retention'], highlights: ['Key & tyre cover', 'NCB retention', 'PA cover'] },
  { _id: 'ins_c_3', category: 'Car', insurer: 'TATA AIG', planName: 'Auto Secure', tagline: 'Trusted car insurance with network garages', basePremium: 6900, rating: 4.3, cashless: true, claimSettlementRate: 89, features: ['Cashless at 7,500+ garages', 'Consumables cover', 'Daily allowance benefit', 'Return to invoice', 'Emergency transport'], highlights: ['Return to invoice', 'Consumables', '7500+ garages'] },
  { _id: 'ins_b_1', category: 'Bike', insurer: 'Acko', planName: 'Bike Comprehensive', tagline: 'Two-wheeler cover in 2 minutes', basePremium: 1450, rating: 4.6, cashless: true, claimSettlementRate: 92, features: ['Instant policy issuance', 'Cashless repairs', 'Zero depreciation add-on', 'Personal accident cover ₹15L', '1-year / 5-year options'], highlights: ['2-min issuance', '5-year option', 'Zero dep'] },
  { _id: 'ins_b_2', category: 'Bike', insurer: 'Digit', planName: 'Bike Insurance', tagline: 'Simple, affordable two-wheeler insurance', basePremium: 1280, rating: 4.4, cashless: true, claimSettlementRate: 90, features: ['Comprehensive cover', 'Cashless at 5,800+ workshops', 'Engine protect', 'Tyre & accessories cover', 'Easy smartphone claims'], highlights: ['Smartphone claims', 'Low premium', 'Engine protect'] },
  { _id: 'ins_b_3', category: 'Bike', insurer: 'Bajaj Allianz', planName: 'Two Wheeler', tagline: 'Reliable bike protection nationwide', basePremium: 1600, rating: 4.3, cashless: true, claimSettlementRate: 88, features: ['Cashless at 4,500+ garages', 'No claim bonus up to 50%', '24x7 roadside assistance', 'Personal accident cover', 'Long-term policy option'], highlights: ['NCB up to 50%', '24x7 RSA', 'Long-term'] },
]

const leads = [
  { _id: 'lead_001', type: 'Investment', name: 'Karthik Subramaniam', email: 'karthik@example.com', phone: '+91 90080 12345', plan: 'Premium', investmentAmount: 1000000, aadhaar: 'XXXX-XXXX-2233', status: 'New', createdAt: iso(2) },
  { _id: 'lead_002', type: 'Insurance', name: 'Meena Joshi', email: 'meena@example.com', phone: '+91 90080 67890', insuranceCategory: 'Health', insurancePlanId: 'ins_h_2', estimatedPremium: 24000, status: 'Contacted', createdAt: iso(5), notes: 'Requested callback for family floater.' },
  { _id: 'lead_003', type: 'Investment', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 90080 33333', plan: 'Standard', investmentAmount: 500000, status: 'In Progress', createdAt: iso(8), notes: 'KYC documents under review.' },
  { _id: 'lead_004', type: 'Insurance', name: 'Sneha Kapoor', email: 'sneha@example.com', phone: '+91 90080 44444', insuranceCategory: 'Car', insurancePlanId: 'ins_c_1', estimatedPremium: 6500, status: 'New', createdAt: iso(1) },
  { _id: 'lead_005', type: 'Insurance', name: 'Mohammed Ali', email: 'ali@example.com', phone: '+91 90080 55555', insuranceCategory: 'Term', insurancePlanId: 'ins_t_2', estimatedPremium: 17500, status: 'Closed', createdAt: iso(20), notes: 'Policy issued. ₹1 Cr term cover.' },
  { _id: 'lead_006', type: 'Contact', name: 'Geeta Rao', email: 'geeta@example.com', phone: '+91 90080 66666', message: 'Wanted to understand the Customised plan for senior citizens.', status: 'New', createdAt: iso(3) },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await User.deleteMany({})
    await Customer.deleteMany({})
    await Lead.deleteMany({})
    await InsurancePlan.deleteMany({})
    await StockPrice.deleteMany({})

    await User.insertMany(users)
    await Customer.insertMany(customers)
    await Lead.insertMany(leads)
    await InsurancePlan.insertMany(insurancePlans)
    await StockPrice.insertMany(stocks)

    console.log(`Seeded: ${users.length} users, ${customers.length} customers, ${leads.length} leads, ${insurancePlans.length} insurance plans, ${stocks.length} stocks`)
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

seed()
