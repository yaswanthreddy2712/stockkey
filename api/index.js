import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

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
    const { name, email, password, phone, aadhaar, pan, plan, paymentMethod, utrNumber, referenceNo } = req.body
    if (!name || !email || !password || !phone) return res.status(400).json({ ok: false, error: 'Missing required fields.' })
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ ok: false, error: 'Account with this email exists.' })
    const planMonthly = plan === 'Premium' ? 120000 : plan === 'Standard' ? 60000 : 12000
    const planInvest = plan === 'Premium' ? 1000000 : plan === 'Standard' ? 500000 : 100000
    const now = new Date().toISOString()
    const cid = `cust_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const customer = await Customer.create({ _id: cid, name, email: email.toLowerCase(), phone, aadhaar: aadhaar || '', pan: pan || 'PENDING', plan, investedAmount: planInvest, monthlyPayout: planMonthly, joinDate: now, status: 'Pending', kycVerified: false, address: '', dateOfBirth: '', photo: '', paymentMethod: paymentMethod || '', utrNumber: utrNumber || '', referenceNo: referenceNo || '', holdings: [], transactions: [{ _id: `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, date: now, type: 'Investment', description: `Enquiry — ${plan} Plan`, amount: 0 }] })
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

// ─── EMAIL SERVICE ─────────────────────────────────────────────────────

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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%); padding: 32px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Stock Key Investments</h1>
          <p style="color: #9ca3af; margin: 8px 0 0;">SEBI Registered · NISM-Certified Experts</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1f2e; margin: 0 0 16px;">Welcome, ${name}! 🎉</h2>
          <p style="color: #475569; line-height: 1.6;">
            Your account has been created successfully. You're now part of the Stock Key Investments family.
          </p>
          <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #475569;"><strong>Account Email:</strong> ${email}</p>
            <p style="margin: 8px 0 0; color: #475569;">You can now log in to view your investment plans and portfolio.</p>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            Our team will verify your payment and activate your account shortly. 
            You'll receive another email once your account is fully active.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://stock-sigma-seven.vercel.app/login" style="background: #D4AF37; color: #1a1f2e; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Login to Dashboard</a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Stock Key Investments · SEBI Registered · NISM-Certified Experts</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0;">Need help? Contact us at <a href="tel:+917013178382" style="color: #D4AF37;">+91 70131 78382</a></p>
        </div>
      </div>
    `,
  }),

  paymentVerified: (name) => ({
    subject: `Payment Verified — Your Investment is Active!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%); padding: 32px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Stock Key Investments</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #16a34a; margin: 0 0 16px;">Payment Verified ✅</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name}, your investment payment has been verified and your account is now <strong>Active</strong>.
          </p>
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #166534;">Your monthly payouts will begin as per your investment plan. You can track everything from your dashboard.</p>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://stock-sigma-seven.vercel.app/dashboard" style="background: #D4AF37; color: #1a1f2e; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Dashboard</a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Stock Key Investments · SEBI Registered · NISM-Certified Experts</p>
        </div>
      </div>
    `,
  }),

  paymentRejected: (name) => ({
    subject: `Payment Verification Issue — Action Required`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%); padding: 32px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Stock Key Investments</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #dc2626; margin: 0 0 16px;">Payment Verification Needed</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name}, we were unable to verify your payment. Please contact our support team to resolve this.
          </p>
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b;">Please call us at <strong>+91 70131 78382</strong> or reply to this email with your payment proof (screenshot/UTR number).</p>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Stock Key Investments · SEBI Registered · NISM-Certified Experts</p>
        </div>
      </div>
    `,
  }),

  monthlyPayout: (name, amount) => ({
    subject: `Monthly Payout of ₹${Number(amount).toLocaleString('en-IN')} Credited!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%); padding: 32px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Stock Key Investments</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #16a34a; margin: 0 0 16px;">Monthly Payout Credited 💰</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name}, your monthly investment payout has been credited to your account.
          </p>
          <div style="text-align: center; margin: 28px 0; padding: 24px; background: #f0fdf4; border-radius: 12px;">
            <p style="color: #166534; margin: 0; font-size: 14px;">Amount Credited</p>
            <p style="color: #16a34a; margin: 8px 0 0; font-size: 32px; font-weight: bold;">₹${Number(amount).toLocaleString('en-IN')}</p>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://stock-sigma-seven.vercel.app/dashboard" style="background: #D4AF37; color: #1a1f2e; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Dashboard</a>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Stock Key Investments · SEBI Registered · NISM-Certified Experts</p>
        </div>
      </div>
    `,
  }),

  broadcast: (name, subject, body) => ({
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%); padding: 32px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Stock Key Investments</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #475569; line-height: 1.6;">Hi ${name},</p>
          <div style="color: #475569; line-height: 1.8; white-space: pre-wrap;">${body}</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Stock Key Investments · SEBI Registered · NISM-Certified Experts</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0;">Need help? Contact us at <a href="tel:+917013178382" style="color: #D4AF37;">+91 70131 78382</a></p>
        </div>
      </div>
    `,
  }),
}

// Email API endpoints
app.post('/api/email/send', async (req, res) => {
  try {
    const { to, template, data } = req.body
    if (!to || !template) return res.status(400).json({ error: 'Missing required fields.' })
    const transporter = createTransporter()
    if (!transporter) return res.status(503).json({ error: 'Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.' })

    let emailContent
    switch (template) {
      case 'welcome': emailContent = emailTemplates.welcome(data?.name || 'Investor', to); break
      case 'paymentVerified': emailContent = emailTemplates.paymentVerified(data?.name || 'Investor'); break
      case 'paymentRejected': emailContent = emailTemplates.paymentRejected(data?.name || 'Investor'); break
      case 'monthlyPayout': emailContent = emailTemplates.monthlyPayout(data?.name || 'Investor', data?.amount || 0); break
      default: return res.status(400).json({ error: 'Unknown template.' })
    }
    await transporter.sendMail({ from: `"Stock Key Investments" <${process.env.SMTP_USER}>`, to, subject: emailContent.subject, html: emailContent.html })
    res.json({ ok: true, message: `Email sent to ${to}` })
  } catch (err) { console.error('Email error:', err.message); res.status(500).json({ error: 'Failed to send email.' }) }
})

app.post('/api/email/broadcast', async (req, res) => {
  try {
    const { subject, body, audience } = req.body
    if (!subject || !body) return res.status(400).json({ error: 'Subject and body are required.' })
    const transporter = createTransporter()
    if (!transporter) return res.status(503).json({ error: 'Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.' })

    let filter = {}
    if (audience === 'Active') filter.status = 'Active'
    else if (audience === 'Pending') filter.status = 'Pending'
    const customers = await Customer.find(filter).select('name email')
    if (customers.length === 0) return res.json({ ok: true, sent: 0, message: 'No customers to email.' })

    let sent = 0, failed = 0
    for (const c of customers) {
      try {
        const content = emailTemplates.broadcast(c.name, subject, body)
        await transporter.sendMail({ from: `"Stock Key Investments" <${process.env.SMTP_USER}>`, to: c.email, subject: content.subject, html: content.html })
        sent++
      } catch { failed++ }
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
