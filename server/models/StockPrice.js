import mongoose from 'mongoose'

const stockPriceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  sector: { type: String, required: true },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  },
})

export default mongoose.model('StockPrice', stockPriceSchema)
