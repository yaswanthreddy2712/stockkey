import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

// ─── MODELS ──────────────────────────────────────────────────────────

const toJSONOpts = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  },
}

const User = mongoose.model('User', new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], required: true },
  customerId: { type: String, default: null },
  createdAt: { type: String, required: true },
}, toJSONOpts))

const Customer = mongoose.model('Customer', new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  aadhaar: { type: String, default: '' },
  pan: { type: String, default: '' },
  plan: { type: String, enum: ['Premium', 'Standard', 'Customised'], required: true },
  investedAmount: { type: Number, required: true },
  monthlyPayout: { type: Number, required: true },
  joinDate: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Pending', 'Inactive'], required: true },
  kycVerified: { type: Boolean, default: false },
  address: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  photo: { type: String, default: '' },
  holdings: [{
    _id: { type: String, required: true },
    symbol: String, name: String,
    assetClass: { type: String, enum: ['Equity', 'Bond', 'ETF', 'IPO', 'Options'] },
    quantity: Number, avgBuyPrice: Number, currentPrice: Number,
  }],
  transactions: [{
    _id: { type: String, required: true },
    date: String,
    type: { type: String, enum: ['Buy', 'Sell', 'Dividend', 'Payout', 'Investment'] },
    description: String, amount: Number,
  }],
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      if (ret.holdings) ret.holdings = ret.holdings.map((h) => ({ id: h._id, ...h, _id: undefined }))
      if (ret.transactions) ret.transactions = ret.transactions.map((t) => ({ id: t._id, ...t, _id: undefined }))
      return ret
    },
  },
}))

const Lead = mongoose.model('Lead', new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['Investment', 'Insurance', 'Contact'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  plan: { type: String, enum: ['Premium', 'Standard', 'Customised'], default: null },
  investmentAmount: { type: Number, default: null },
  aadhaar: { type: String, default: null },
  insuranceCategory: { type: String, enum: ['Health', 'Term', 'Car', 'Bike'], default: null },
  insurancePlanId: { type: String, default: null },
  estimatedPremium: { type: Number, default: null },
  message: { type: String, default: null },
  status: { type: String, enum: ['New', 'Contacted', 'In Progress', 'Closed', 'Lost'], required: true },
  createdAt: { type: String, required: true },
  notes: { type: String, default: null },
}, toJSONOpts))

const InsurancePlan = mongoose.model('InsurancePlan', new mongoose.Schema({
  _id: { type: String, required: true },
  category: { type: String, enum: ['Health', 'Term', 'Car', 'Bike'], required: true },
  insurer: { type: String, required: true },
  planName: { type: String, required: true },
  tagline: { type: String, required: true },
  basePremium: { type: Number, required: true },
  features: [String],
  rating: { type: Number, required: true },
  highlights: [String],
  cashless: { type: Boolean, default: false },
  claimSettlementRate: { type: Number, default: null },
}, toJSONOpts))

const StockPrice = mongoose.model('StockPrice', new mongoose.Schema({
  _id: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  sector: { type: String, required: true },
}, toJSONOpts))

const ContactMessage = mongoose.model('ContactMessage', new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true },
}, toJSONOpts))

// ─── EXPRESS APP ──────────────────────────────────────────────────────

const app = express()
app.use(cors())
app.use(express.json())

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required.' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || user.password !== password) return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId, createdAt: user.createdAt } })
  } catch { res.status(500).json({ ok: false, error: 'Server error.' }) }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, aadhaar, pan, plan } = req.body
    if (!name || !email || !password || !phone) return res.status(400).json({ ok: false, error: 'Missing required fields.' })
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ ok: false, error: 'Account with this email exists.' })
    const planMonthly = plan === 'Premium' ? 120000 : plan === 'Standard' ? 60000 : 12000
    const planInvest = plan === 'Premium' ? 1000000 : plan === 'Standard' ? 500000 : 100000
    const now = new Date().toISOString()
    const cid = `cust_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const customer = await Customer.create({ _id: cid, name, email: email.toLowerCase(), phone, aadhaar: aadhaar || '', pan: pan || 'PENDING', plan, investedAmount: planInvest, monthlyPayout: planMonthly, joinDate: now, status: 'Pending', kycVerified: false, address: '', dateOfBirth: '', photo: '', holdings: [], transactions: [{ _id: `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, date: now, type: 'Investment', description: `Enquiry — ${plan} Plan`, amount: 0 }] })
    const uid = `user_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const user = await User.create({ _id: uid, name, email: email.toLowerCase(), password, role: 'customer', customerId: customer._id, createdAt: now })
    res.status(201).json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId, createdAt: user.createdAt } })
  } catch { res.status(500).json({ ok: false, error: 'Server error.' }) }
})

app.get('/api/auth/session/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password')
    if (!user) return res.status(404).json({ ok: false, error: 'User not found.' })
    res.json({ ok: true, user })
  } catch { res.status(500).json({ ok: false, error: 'Server error.' }) }
})

// Customers
app.get('/api/customers', async (_req, res) => {
  try { res.json(await Customer.find().sort({ joinDate: -1 })) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.get('/api/customers/:id', async (req, res) => {
  try { const c = await Customer.findById(req.params.id); c ? res.json(c) : res.status(404).json({ error: 'Not found.' }) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.post('/api/customers', async (req, res) => {
  try { const id = `cust_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; res.status(201).json(await Customer.create({ ...req.body, _id: id })) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.put('/api/customers/:id', async (req, res) => {
  try { const c = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true }); c ? res.json(c) : res.status(404).json({ error: 'Not found.' }) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.delete('/api/customers/:id', async (req, res) => {
  try { await Customer.findByIdAndDelete(req.params.id); await User.deleteMany({ customerId: req.params.id }); res.json({ ok: true }) } catch { res.status(500).json({ error: 'Server error.' }) }
})

// Leads
app.get('/api/leads', async (req, res) => {
  try {
    const { type, status } = req.query
    const filter = {}
    if (type) filter.type = type
    if (status && status !== 'All') filter.status = status
    res.json(await Lead.find(filter).sort({ createdAt: -1 }))
  } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.get('/api/leads/:id', async (req, res) => {
  try { const l = await Lead.findById(req.params.id); l ? res.json(l) : res.status(404).json({ error: 'Not found.' }) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.post('/api/leads', async (req, res) => {
  try {
    const id = `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    res.status(201).json(await Lead.create({ ...req.body, _id: id, createdAt: new Date().toISOString(), status: req.body.status || 'New' }))
  } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.put('/api/leads/:id', async (req, res) => {
  try { const l = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true }); l ? res.json(l) : res.status(404).json({ error: 'Not found.' }) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.delete('/api/leads/:id', async (req, res) => {
  try { await Lead.findByIdAndDelete(req.params.id); res.json({ ok: true }) } catch { res.status(500).json({ error: 'Server error.' }) }
})

// Messages
app.get('/api/messages', async (_req, res) => {
  try { res.json(await ContactMessage.find().sort({ createdAt: -1 })) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.post('/api/messages', async (req, res) => {
  try {
    const id = `msg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    res.status(201).json(await ContactMessage.create({ ...req.body, _id: id, createdAt: new Date().toISOString() }))
  } catch { res.status(500).json({ error: 'Server error.' }) }
})

// Reference data
app.get('/api/insurance-plans', async (_req, res) => {
  try { res.json(await InsurancePlan.find()) } catch { res.status(500).json({ error: 'Server error.' }) }
})
app.get('/api/stocks', async (_req, res) => {
  try { res.json(await StockPrice.find()) } catch { res.status(500).json({ error: 'Server error.' }) }
})

// ─── VERCEL HANDLER ───────────────────────────────────────────────────

let cachedDb = null

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI env var not set')
  cachedDb = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000, connectTimeoutMS: 8000 })
  return cachedDb
}

export default async function handler(req, res) {
  try { await connectDB() } catch (err) { console.error('DB error:', err.message) }
  return app(req, res)
}
