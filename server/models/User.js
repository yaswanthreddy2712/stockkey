import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], required: true },
  customerId: { type: String, default: null },
  createdAt: { type: String, required: true },
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

export default mongoose.model('User', userSchema)
