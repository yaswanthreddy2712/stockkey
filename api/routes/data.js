import { Router } from 'express'
import InsurancePlan from '../models/InsurancePlan.js'
import StockPrice from '../models/StockPrice.js'

const router = Router()

// GET /api/insurance-plans
router.get('/insurance-plans', async (req, res) => {
  try {
    const plans = await InsurancePlan.find()
    res.json(plans)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

// GET /api/stocks
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await StockPrice.find()
    res.json(stocks)
  } catch (err) {
    res.status(500).json({ error: 'Server error.' })
  }
})

export default router
