import mongoose from 'mongoose'

const insurancePlanSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  category: { type: String, enum: ['Health', 'Term', 'Car', 'Bike'], required: true },
  insurer: { type: String, required: true },
  planName: { type: String, required: true },
  tagline: { type: String, required: true },
  basePremium: { type: Number, required: true },
  features: [{ type: String }],
  rating: { type: Number, required: true },
  highlights: [{ type: String }],
  cashless: { type: Boolean, default: false },
  claimSettlementRate: { type: Number, default: null },
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

export default mongoose.model('InsurancePlan', insurancePlanSchema)
