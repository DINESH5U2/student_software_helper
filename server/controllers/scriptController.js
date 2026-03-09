import { nanoid } from 'nanoid'
import Tool from '../models/Tool.js'
import Script from '../models/Script.js'
import { generateBatchScript } from '../services/scriptGeneratorService.js'
import { validateGeneratePayload } from '../services/validationService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const generateScript = asyncHandler(async (req, res) => {
  const errors = validateGeneratePayload(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('; ') })
  }

  const { selectedTools } = req.body
  const toolIds = selectedTools.map(t => t.toolId)
  const tools = await Tool.find({ _id: { $in: toolIds }, isActive: true })

  const toolsWithVersions = selectedTools.map(sel => {
    const tool = tools.find(t => t._id.toString() === sel.toolId)
    if (!tool) throw Object.assign(new Error(`Tool ${sel.toolId} not found`), { status: 404 })
    const versionData = tool.versions.find(v => v.version === sel.version)
    if (!versionData) throw Object.assign(new Error(`Version ${sel.version} not found for ${tool.name}`), { status: 404 })
    return { ...tool.toObject(), selectedVersion: versionData }
  })

  const generatedScript = generateBatchScript(toolsWithVersions)
  const shareId = nanoid(10)

  const script = await Script.create({
    shareId,
    selectedTools: selectedTools.map((sel, i) => ({
      toolId: sel.toolId,
      toolName: toolsWithVersions[i].name,
      version: sel.version
    })),
    generatedScript
  })

  res.status(201).json({
    success: true,
    data: { shareId: script.shareId, generatedScript: script.generatedScript, selectedTools: script.selectedTools }
  })
})

export const getScriptByShareId = asyncHandler(async (req, res) => {
  const script = await Script.findOne({ shareId: req.params.shareId })
  if (!script) {
    const err = new Error('Script not found or expired'); err.status = 404; throw err
  }
  res.json({ success: true, data: script })
})

export const downloadScript = asyncHandler(async (req, res) => {
  const script = await Script.findOne({ shareId: req.params.shareId })
  if (!script) {
    const err = new Error('Script not found or expired'); err.status = 404; throw err
  }
  const filename = `devsetup_${req.params.shareId}.bat`
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Content-Type', 'application/octet-stream')
  res.send(script.generatedScript)
})
