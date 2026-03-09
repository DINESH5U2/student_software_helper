import Tool from '../models/Tool.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const getAllTools = asyncHandler(async (req, res) => {
  const tools = await Tool.find({ isActive: true }).sort({ category: 1, name: 1 })
  res.json({ success: true, data: tools })
})

export const getToolVersions = asyncHandler(async (req, res) => {
  const tool = await Tool.findOne({ slug: req.params.slug, isActive: true }, 'name slug versions')
  if (!tool) {
    const err = new Error('Tool not found'); err.status = 404; throw err
  }
  res.json({ success: true, data: tool.versions })
})
