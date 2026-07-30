import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['Investment', 'Insurance', 'Contact'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  plan: { type: String, enum: ['Premium', 'Standard', 'Customised'], default: null },
  investmentAmount: { type: Number, default: null },
  aadhaar: { type: String, default: null },
  insuranceCategory: { type: String, enum: ['Health', 'Term', 'Car', 'Bike'], default: null },
  insurancePlanId: { type: String, default: null },
  estimatedPremium: { type: Number, default: null },
  message: { type: String, default: null },
  status: { type: String, enum: ['New', 'Contacted', 'In Progress', 'Closed', 'Lost'], required: true },
  createdAt: { type: String, required: true },
  notes: { type: String, default: null },
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

export default mongoose.model('Lead', leadSchema)
