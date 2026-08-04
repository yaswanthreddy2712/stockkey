import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import https from 'https'

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
  paymentMethod: { type: String, enum: ['UPI (GPay/PhonePe/Paytm)', 'Bank Transfer / NEFT / RTGS', 'Cheque', 'Cash'], default: '' },
  utrNumber: { type: String, default: '' },
  referenceNo: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
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

// ─── OTP STORE (MongoDB for serverless persistence) ────────────────────
const OTP = mongoose.model('OTP', new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  attempts: { type: Number, default: 0 },
}, { timestamps: false }))

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function saveOTP(email, code) {
  await OTP.deleteMany({ email: email.toLowerCase() })
  await OTP.create({ email: email.toLowerCase(), code, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 })
}

async function verifyAndConsumeOTP(email, otp) {
  const record = await OTP.findOne({ email: email.toLowerCase() })
  if (!record) return { ok: false, error: 'No OTP requested. Please request a new one.' }
  if (Date.now() > record.expiresAt) { await OTP.deleteOne({ _id: record._id }); return { ok: false, error: 'OTP expired. Please request a new one.' } }
  if (record.attempts >= 5) { await OTP.deleteOne({ _id: record._id }); return { ok: false, error: 'Too many attempts. Please request a new OTP.' } }
  record.attempts++
  await record.save()
  if (record.code !== otp) return { ok: false, error: `Incorrect OTP. ${5 - record.attempts} attempts remaining.` }
  await OTP.deleteOne({ _id: record._id })
  return { ok: true }
}

// ─── OTP ENDPOINTS ─────────────────────────────────────────────────────
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, error: 'Email is required.' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ ok: false, error: 'No account found with this email.' })

    const code = generateOTP()
    await saveOTP(email.toLowerCase(), code)

    const transporter = createTransporter()
    if (!transporter) return res.status(503).json({ ok: false, error: 'Email service not configured.' })

    await transporter.sendMail({
      from: `"Stock Key Investments" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Login OTP: ${code}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#fff;">
          <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:28px;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:22px;">Stock Key Investments</h1>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="color:#475569;font-size:14px;margin-bottom:8px;">Your One-Time Password (OTP)</p>
            <div style="background:#f8f9fa;border:2px dashed #D4AF37;border-radius:12px;padding:20px;margin:16px 0;">
              <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1a1f2e;margin:0;">${code}</p>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin-top:16px;">This OTP expires in <strong>5 minutes</strong>.</p>
            <p style="color:#9ca3af;font-size:12px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background:#f8f9fa;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">Stock Key Investments · NISM Certified</p>
          </div>
        </div>
      `,
    })

    res.json({ ok: true, message: `OTP sent to ${email}` })
  } catch (err) { console.error('Send OTP error:', err.message); res.status(500).json({ ok: false, error: 'Failed to send OTP.' }) }
})

// Registration OTP — sends OTP without requiring existing account
app.post('/api/auth/send-register-otp', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, error: 'Email is required.' })
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ ok: false, error: 'An account with this email already exists.' })

    const code = generateOTP()
    await saveOTP('reg_' + email.toLowerCase(), code)

    const transporter = createTransporter()
    if (!transporter) return res.status(503).json({ ok: false, error: 'Email service not configured.' })

    await transporter.sendMail({
      from: `"Stock Key Investments" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Verify your email — OTP: ${code}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#fff;">
          <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:28px;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:22px;">Stock Key Investments</h1>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="color:#475569;font-size:14px;margin-bottom:8px;">Verify your email to create an account</p>
            <div style="background:#f8f9fa;border:2px dashed #D4AF37;border-radius:12px;padding:20px;margin:16px 0;">
              <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1a1f2e;margin:0;">${code}</p>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin-top:16px;">This OTP expires in <strong>5 minutes</strong>.</p>
            <p style="color:#9ca3af;font-size:12px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background:#f8f9fa;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">Stock Key Investments · NISM Certified</p>
          </div>
        </div>
      `,
    })

    res.json({ ok: true, message: `OTP sent to ${email}` })
  } catch (err) { console.error('Send register OTP error:', err.message); res.status(500).json({ ok: false, error: 'Failed to send OTP.' }) }
})

// Verify registration OTP (no account needed)
app.post('/api/auth/verify-register-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, error: 'Email and OTP are required.' })

    const result = await verifyAndConsumeOTP('reg_' + email.toLowerCase(), otp)
    if (!result.ok) return res.status(401).json(result)

    res.json({ ok: true, message: 'Email verified successfully.' })
  } catch (err) { console.error('Verify register OTP error:', err.message); res.status(500).json({ ok: false, error: 'Failed to verify OTP.' }) }
})

// Verify login OTP (account must exist)
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, error: 'Email and OTP are required.' })

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ ok: false, error: 'Account not found.' })
    if (user.role === 'admin') return res.status(403).json({ ok: false, error: 'Admin must login with password.' })

    const result = await verifyAndConsumeOTP(email.toLowerCase(), otp)
    if (!result.ok) return res.status(401).json(result)

    sendLoginNotification(user.name, user.email, user.role, req)
    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId, createdAt: user.createdAt } })
  } catch (err) { console.error('Verify OTP error:', err.message); res.status(500).json({ ok: false, error: 'Failed to verify OTP.' }) }
})

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required.' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    if (user.role !== 'admin') return res.status(403).json({ ok: false, error: 'Customers must login with OTP.' })
    if (user.password !== password) return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    sendLoginNotification(user.name, user.email, user.role, req)
    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId, createdAt: user.createdAt } })
  } catch { res.status(500).json({ ok: false, error: 'Server error.' }) }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, aadhaar, pan, plan, paymentMethod, utrNumber, referenceNo } = req.body
    if (!name || !email || !password || !phone) return res.status(400).json({ ok: false, error: 'Missing required fields.' })
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ ok: false, error: 'Account with this email exists.' })
    const planMonthly = plan === 'Premium' ? 120000 : plan === 'Standard' ? 60000 : 12000
    const planInvest = plan === 'Premium' ? 1000000 : plan === 'Standard' ? 500000 : 100000
    const now = new Date().toISOString()
    const cid = `cust_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    let uid_h = `h_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    let uid_h2 = `h_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
    let uid_h3 = `h_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    let uid_t = `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const defaultHoldings = plan === 'Premium' ? [
      { _id: uid_h, symbol: 'RELIANCE', name: 'Reliance Industries', assetClass: 'Equity', quantity: 30, avgBuyPrice: 2650, currentPrice: 2945.6 },
      { _id: uid_h2, symbol: 'HDFCBANK', name: 'HDFC Bank', assetClass: 'Equity', quantity: 50, avgBuyPrice: 1520, currentPrice: 1689.75 },
      { _id: uid_h3, symbol: 'NIFTYBEES', name: 'Nippon India Nifty ETF', assetClass: 'ETF', quantity: 400, avgBuyPrice: 240, currentPrice: 268.4 },
    ] : plan === 'Standard' ? [
      { _id: uid_h, symbol: 'TCS', name: 'Tata Consultancy Services', assetClass: 'Equity', quantity: 15, avgBuyPrice: 3520, currentPrice: 3890.25 },
      { _id: uid_h2, symbol: 'ICICIBANK', name: 'ICICI Bank', assetClass: 'Equity', quantity: 40, avgBuyPrice: 980, currentPrice: 1124.3 },
    ] : [
      { _id: uid_h, symbol: 'ITC', name: 'ITC Limited', assetClass: 'Equity', quantity: 100, avgBuyPrice: 405, currentPrice: 432.8 },
      { _id: uid_h2, symbol: 'NIFTYBEES', name: 'Nippon India Nifty ETF', assetClass: 'ETF', quantity: 100, avgBuyPrice: 240, currentPrice: 268.4 },
    ]
    const defaultTransactions = [
      { _id: uid_t, date: now, type: 'Investment', description: `Initial investment — ${plan} Plan`, amount: -planInvest },
    ]
    const customer = await Customer.create({ _id: cid, name, email: email.toLowerCase(), phone, aadhaar: aadhaar || '', pan: pan || 'PENDING', plan, investedAmount: planInvest, monthlyPayout: planMonthly, joinDate: now, status: 'Pending', kycVerified: false, address: '', dateOfBirth: '', photo: '', paymentMethod: paymentMethod || '', utrNumber: utrNumber || '', referenceNo: referenceNo || '', holdings: defaultHoldings, transactions: defaultTransactions })
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

// ─── EMAIL SERVICE (Gmail SMTP) ────────────────────────────────────────

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

const emailTemplates = {
  welcome: (name, email) => ({
    subject: `Welcome to Stock Key Investments, ${name}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:32px;text-align:center;">
          <h1 style="color:#D4AF37;margin:0;font-size:24px;">Stock Key Investments</h1>
          <p style="color:#9ca3af;margin:8px 0 0;">NISM-Certified Experts</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1a1f2e;margin:0 0 16px;">Welcome, ${name}!</h2>
          <p style="color:#475569;line-height:1.6;">Your account has been created successfully. You're now part of the Stock Key Investments family.</p>
          <div style="background:#f8f9fa;border-left:4px solid #D4AF37;padding:16px;margin:20px 0;border-radius:4px;">
            <p style="margin:0;color:#475569;"><strong>Account Email:</strong> ${email}</p>
            <p style="margin:8px 0 0;color:#475569;">You can now log in to view your investment plans and portfolio.</p>
          </div>
          <p style="color:#475569;line-height:1.6;">Our team will verify your payment and activate your account shortly.</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="https://stock-sigma-seven.vercel.app/login" style="background:#D4AF37;color:#1a1f2e;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:bold;">Login to Dashboard</a>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">Stock Key Investments · NISM-Certified Experts</p>
          <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">Need help? Call <a href="tel:+917013178382" style="color:#D4AF37;">+91 70131 78382</a></p>
        </div>
      </div>
    `,
  }),

  paymentVerified: (name) => ({
    subject: `Payment Verified — Your Investment is Active!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:32px;text-align:center;">
          <h1 style="color:#D4AF37;margin:0;font-size:24px;">Stock Key Investments</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#16a34a;margin:0 0 16px;">Payment Verified</h2>
          <p style="color:#475569;line-height:1.6;">Hi ${name}, your investment payment has been verified and your account is now <strong>Active</strong>.</p>
          <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px;margin:20px 0;border-radius:4px;">
            <p style="margin:0;color:#166534;">Your monthly payouts will begin as per your investment plan. Track everything from your dashboard.</p>
          </div>
          <div style="text-align:center;margin:28px 0;">
            <a href="https://stock-sigma-seven.vercel.app/dashboard" style="background:#D4AF37;color:#1a1f2e;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:bold;">View Dashboard</a>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">Stock Key Investments · NISM-Certified Experts</p>
        </div>
      </div>
    `,
  }),

  paymentRejected: (name) => ({
    subject: `Payment Verification Issue — Action Required`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:32px;text-align:center;">
          <h1 style="color:#D4AF37;margin:0;font-size:24px;">Stock Key Investments</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#dc2626;margin:0 0 16px;">Payment Verification Needed</h2>
          <p style="color:#475569;line-height:1.6;">Hi ${name}, we were unable to verify your payment. Please contact our support team.</p>
          <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;margin:20px 0;border-radius:4px;">
            <p style="margin:0;color:#991b1b;">Please call <strong>+91 70131 78382</strong> or reply with your payment proof (screenshot/UTR number).</p>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">Stock Key Investments · NISM-Certified Experts</p>
        </div>
      </div>
    `,
  }),

  monthlyPayout: (name, amount) => ({
    subject: `Monthly Payout of ₹${Number(amount).toLocaleString('en-IN')} Credited!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:32px;text-align:center;">
          <h1 style="color:#D4AF37;margin:0;font-size:24px;">Stock Key Investments</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#16a34a;margin:0 0 16px;">Monthly Payout Credited!</h2>
          <p style="color:#475569;line-height:1.6;">Hi ${name}, your monthly investment payout has been credited.</p>
          <div style="text-align:center;margin:28px 0;padding:24px;background:#f0fdf4;border-radius:12px;">
            <p style="color:#166534;margin:0;font-size:14px;">Amount Credited</p>
            <p style="color:#16a34a;margin:8px 0 0;font-size:32px;font-weight:bold;">₹${Number(amount).toLocaleString('en-IN')}</p>
          </div>
          <div style="text-align:center;margin:28px 0;">
            <a href="https://stock-sigma-seven.vercel.app/dashboard" style="background:#D4AF37;color:#1a1f2e;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:bold;">View Dashboard</a>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">Stock Key Investments · NISM-Certified Experts</p>
        </div>
      </div>
    `,
  }),

  broadcast: (name, subject, body) => ({
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:32px;text-align:center;">
          <h1 style="color:#D4AF37;margin:0;font-size:24px;">Stock Key Investments</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
          <div style="color:#475569;line-height:1.8;white-space:pre-wrap;">${body}</div>
        </div>
        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">Stock Key Investments · NISM-Certified Experts</p>
          <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">Call <a href="tel:+917013178382" style="color:#D4AF37;">+91 70131 78382</a></p>
        </div>
      </div>
    `,
  }),
}

// ─── LOGIN NOTIFICATION ────────────────────────────────────────────────

function parseUserAgent(ua) {
  if (!ua) return { device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS' }
  let device = 'Desktop', browser = 'Unknown Browser', os = 'Unknown OS'
  if (/android/i.test(ua)) { device = 'Android'; os = 'Android' }
  else if (/iphone/i.test(ua)) { device = 'iPhone'; os = 'iOS' }
  else if (/ipad/i.test(ua)) { device = 'iPad'; os = 'iOS' }
  else if (/windows/i.test(ua)) os = 'Windows'
  else if (/macintosh|mac os/i.test(ua)) os = 'macOS'
  else if (/linux/i.test(ua)) os = 'Linux'
  if (/chrome/i.test(ua) && !/edge|opr|opera/i.test(ua)) browser = 'Chrome'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
  else if (/edge/i.test(ua)) browser = 'Edge'
  else if (/opr|opera/i.test(ua)) browser = 'Opera'
  if (/mobile/i.test(ua) && device === 'Desktop') device = 'Mobile'
  return { device, browser, os }
}

function fetchIPInfo(ip) {
  return new Promise((resolve) => {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
      return resolve({ city: 'Local', region: '', country: '', isp: '' })
    }
    const url = `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,query`
    https.get(url, (resp) => {
      let data = ''
      resp.on('data', (chunk) => { data += chunk })
      resp.on('end', () => {
        try {
          const j = JSON.parse(data)
          resolve({ city: j.city || 'Unknown', region: j.regionName || '', country: j.country || '', isp: j.isp || '', query: j.query || ip })
        } catch { resolve({ city: 'Unknown', region: '', country: '', isp: '' }) }
      })
    }).on('error', () => resolve({ city: 'Unknown', region: '', country: '', isp: '' }))
  })
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.connection?.remoteAddress || ''
}

async function sendLoginNotification(userName, userEmail, role, req) {
  try {
    const transporter = createTransporter()
    if (!transporter) return
    const ip = getClientIP(req)
    const ua = req.headers['user-agent'] || ''
    const { device, browser, os } = parseUserAgent(ua)
    const ipInfo = await fetchIPInfo(ip)
    const location = [ipInfo.city, ipInfo.region, ipInfo.country].filter(Boolean).join(', ') || 'Unknown'
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    await transporter.sendMail({
      from: `"Stock Key Investments" <${process.env.SMTP_USER}>`,
      to: [process.env.SMTP_USER, 'admin@stockkey.in'].filter(Boolean).join(','),
      subject: `🔐 Login Alert — ${userName} (${role})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
          <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0d1117 100%);padding:32px;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:24px;">Stock Key Investments</h1>
            <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">Login Notification</p>
          </div>
          <div style="padding:32px;">
            <div style="background:#fef3c7;border-left:4px solid #D4AF37;padding:16px;border-radius:8px;margin-bottom:24px;">
              <p style="color:#92400e;font-weight:bold;margin:0;font-size:16px;">⚠️ New Login Detected</p>
            </div>
            <table style="width:100%;border-collapse:collapse;color:#475569;">
              <tr><td style="padding:10px 0;font-weight:600;width:140px;">User</td><td>${userName}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Email</td><td>${userEmail}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Role</td><td style="text-transform:capitalize;">${role}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Location</td><td>${location}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">IP Address</td><td>${ip || 'N/A'}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Device</td><td>${device}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Browser</td><td>${browser}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">OS</td><td>${os}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">ISP</td><td>${ipInfo.isp || 'N/A'}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Time</td><td>${now} IST</td></tr>
            </table>
          </div>
          <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">Stock Key Investments · NISM-Certified Experts</p>
          </div>
        </div>
      `,
    })
  } catch (err) { console.error('Login notification error:', err.message) }
}

// Email API endpoints
app.post('/api/email/send', async (req, res) => {
  try {
    const { to, template, data } = req.body
    if (!to || !template) return res.status(400).json({ error: 'Missing required fields.' })
    const transporter = createTransporter()
    if (!transporter) return res.status(503).json({ error: 'Email not configured. Set SMTP env vars.' })

    let emailContent
    switch (template) {
      case 'welcome': emailContent = emailTemplates.welcome(data?.name || 'Investor', to); break
      case 'paymentVerified': emailContent = emailTemplates.paymentVerified(data?.name || 'Investor'); break
      case 'paymentRejected': emailContent = emailTemplates.paymentRejected(data?.name || 'Investor'); break
      case 'monthlyPayout': emailContent = emailTemplates.monthlyPayout(data?.name || 'Investor', data?.amount || 0); break
      default: return res.status(400).json({ error: 'Unknown template.' })
    }
    await transporter.sendMail({ from: `"Stock Key Investments" <${process.env.SMTP_USER}>`, to, subject: emailContent.subject, html: emailContent.html, headers: { 'X-Mailer': 'StockKeyMailer', 'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>` } })
    res.json({ ok: true, message: `Email sent to ${to}` })
  } catch (err) { console.error('Email error:', err.message); res.status(500).json({ error: 'Failed to send email.' }) }
})

app.post('/api/email/broadcast', async (req, res) => {
  try {
    const { subject, body, audience } = req.body
    if (!subject || !body) return res.status(400).json({ error: 'Subject and body are required.' })
    const transporter = createTransporter()
    if (!transporter) return res.status(503).json({ error: 'Email not configured. Set SMTP env vars.' })

    let filter = {}
    if (audience === 'Active') filter.status = 'Active'
    else if (audience === 'Pending') filter.status = 'Pending'
    const customers = await Customer.find(filter).select('name email')
    if (customers.length === 0) return res.json({ ok: true, sent: 0, message: 'No customers to email.' })

    let sent = 0, failed = 0
    for (const c of customers) {
      try {
        const content = emailTemplates.broadcast(c.name, subject, body)
        await transporter.sendMail({ from: `"Stock Key Investments" <${process.env.SMTP_USER}>`, to: c.email, subject: content.subject, html: content.html, headers: { 'X-Mailer': 'StockKeyMailer', 'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>` } })
        sent++
      } catch (e) { console.error('Broadcast send error:', e.message); failed++ }
    }
    res.json({ ok: true, sent, failed, total: customers.length })
  } catch (err) { console.error('Broadcast error:', err.message); res.status(500).json({ error: 'Failed to broadcast.' }) }
})

app.get('/api/email/check-config', (_req, res) => {
  const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  res.json({ configured, host: process.env.SMTP_HOST || null, user: process.env.SMTP_USER || null })
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
