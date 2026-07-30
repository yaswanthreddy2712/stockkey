import { Router } from 'express'
import User from '../models/User.js'
import Customer from '../models/Customer.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || user.password !== password) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    }
    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId, createdAt: user.createdAt } })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Server error.' })
  }
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, aadhaar, plan } = req.body
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ ok: false, error: 'Missing required fields.' })
    }
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ ok: false, error: 'An account with this email already exists.' })
    }

    const planMonthly = plan === 'Premium' ? 40000 : plan === 'Standard' ? 20000 : 0
    const planInvest = plan === 'Premium' ? 1000000 : plan === 'Standard' ? 500000 : 100000
    const now = new Date().toISOString()
    const customerId = `cust_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

    const customer = await Customer.create({
      _id: customerId,
      name,
      email: email.toLowerCase(),
      phone,
      aadhaar: aadhaar || '',
      pan: 'PENDING',
      plan,
      investedAmount: planInvest,
      monthlyPayout: planMonthly,
      joinDate: now,
      status: 'Pending',
      kycVerified: false,
      address: '',
      dateOfBirth: '',
      holdings: [],
      transactions: [{
        _id: `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        date: now,
        type: 'Investment',
        description: `Enquiry — ${plan} Plan (awaiting confirmation)`,
        amount: 0,
      }],
    })

    const userId = `user_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const user = await User.create({
      _id: userId,
      name,
      email: email.toLowerCase(),
      password,
      role: 'customer',
      customerId: customer._id,
      createdAt: now,
    })

    res.status(201).json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, customerId: user.customerId, createdAt: user.createdAt },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Server error.' })
  }
})

// GET /api/auth/session — resolve user from stored userId
router.get('/session/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password')
    if (!user) return res.status(404).json({ ok: false, error: 'User not found.' })
    res.json({ ok: true, user })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Server error.' })
  }
})

export default router
