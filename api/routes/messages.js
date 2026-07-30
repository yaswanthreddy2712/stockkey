import { Router } from 'express'
import ContactMessage from '../models/ContactMessage.js'

const router = Router()

// GET /api/messages
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const id = `msg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const message = await ContactMessage.create({
      ...req.body,
      _id: id,
      createdAt: new Date().toISOString(),
    })
    res.status(201).json(message)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

export default router
