import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import customerRoutes from './routes/customers.js'
import leadRoutes from './routes/leads.js'
import messageRoutes from './routes/messages.js'
import dataRoutes from './routes/data.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api', dataRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Stock Key API is running' })
})

let cachedDb = null

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI env var is not set')
  cachedDb = await mongoose.connect(MONGODB_URI)
  return cachedDb
}

export default async function handler(req, res) {
  try {
    await connectDB()
  } catch (err) {
    console.error('DB connect error:', err.message)
  }
  return app(req, res)
}
