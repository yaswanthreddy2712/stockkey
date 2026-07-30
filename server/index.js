import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import customerRoutes from './routes/customers.js'
import leadRoutes from './routes/leads.js'
import messageRoutes from './routes/messages.js'
import dataRoutes from './routes/data.js'

const app = express()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-key'

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api', dataRoutes)

// Root
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Stock Key Investments API — use /api/* endpoints' })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Stock Key API is running' })
})

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
