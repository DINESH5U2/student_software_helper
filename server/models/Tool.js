import mongoose from 'mongoose'

const versionSchema = new mongoose.Schema({
  version: { type: String, required: true },
  installerUrl: { type: String, required: true },
  silentFlags: { type: String, default: '' },
  arch: { type: String, enum: ['x64', 'x86', 'any'], default: 'x64' }
}, { _id: false })

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['language', 'runtime', 'vcs', 'ide', 'database', 'communication', 'utility', 'build'],
    required: true
  },
  icon: { type: String, default: '🔧' },
  versions: [versionSchema],
  verifyCommand: { type: String },
  envVar: { type: String },
  envPath: { type: String },
  installDir: { type: String },
  prerequisites: [{ type: String }],
  isEnvOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('Tool', toolSchema)