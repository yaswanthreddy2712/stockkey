import { Router } from 'express'
import Lead from '../models/Lead.js'

const router = Router()

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query
    const filter = {}
    if (type) filter.type = type
    if (status && status !== 'All') filter.status = status
    const leads = await Lead.find(filter).sort({ createdAt: -1 })
    res.json(leads)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// GET /api/leads/:id
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) return res.status(404).json({ error: 'Lead not found.' })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const id = `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const lead = await Lead.create({
      ...req.body,
      _id: id,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'New',
    })
    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// PUT /api/leads/:id
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!lead) return res.status(404).json({ error: 'Lead not found.' })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// DELETE /api/leads/:id
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

export default router
