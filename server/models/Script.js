import mongoose from 'mongoose'

const selectedToolSchema = new mongoose.Schema({
  toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  toolName: { type: String, required: true },
  version: { type: String, required: true }
}, { _id: false })

const scriptSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true, index: true },
  selectedTools: [selectedToolSchema],
  generatedScript: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), index: { expireAfterSeconds: 0 } }
})

export default mongoose.model('Script', scriptSchema)
