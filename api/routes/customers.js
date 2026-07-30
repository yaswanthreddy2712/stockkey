import { Router } from 'express'
import Customer from '../models/Customer.js'
import User from '../models/User.js'

const router = Router()

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ joinDate: -1 })
    res.json(customers)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).json({ error: 'Customer not found.' })
    res.json(customer)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const id = `cust_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const customer = await Customer.create({ ...req.body, _id: id })
    res.status(201).json(customer)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!customer) return res.status(404).json({ error: 'Customer not found.' })
    res.json(customer)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id)
    await User.deleteMany({ customerId: req.params.id })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

export default router
