import mongoose from 'mongoose'

const holdingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  assetClass: { type: String, enum: ['Equity', 'Bond', 'ETF', 'IPO', 'Options'], required: true },
  quantity: { type: Number, required: true },
  avgBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
}, { _id: false })

const transactionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['Buy', 'Sell', 'Dividend', 'Payout', 'Investment'], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: false })

const customerSchema = new mongoose.Schema({
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
  holdings: [holdingSchema],
  transactions: [transactionSchema],
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      // Map subdocument _id to id
      if (ret.holdings) {
        ret.holdings = ret.holdings.map((h) => {
          const { _id, ...rest } = h
          return { id: _id, ...rest }
        })
      }
      if (ret.transactions) {
        ret.transactions = ret.transactions.map((t) => {
          const { _id, ...rest } = t
          return { id: _id, ...rest }
        })
      }
      return ret
    },
  },
})

export default mongoose.model('Customer', customerSchema)
