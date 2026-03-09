import Tool from '../models/Tool.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const getAllToolsAdmin = asyncHandler(async (req, res) => {
  const tools = await Tool.find().sort({ createdAt: -1 })
  res.json({ success: true, data: tools })
})

export const createTool = asyncHandler(async (req, res) => {
  const tool = await Tool.create(req.body)
  res.status(201).json({ success: true, data: tool })
})

export const updateTool = asyncHandler(async (req, res) => {
  const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!tool) { const err = new Error('Tool not found'); err.status = 404; throw err }
  res.json({ success: true, data: tool })
})

export const deleteTool = asyncHandler(async (req, res) => {
  const tool = await Tool.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
  if (!tool) { const err = new Error('Tool not found'); err.status = 404; throw err }
  res.json({ success: true, data: { message: 'Tool deactivated' } })
})
