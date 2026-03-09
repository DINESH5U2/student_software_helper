import { Router } from 'express'
import { generateScript, getScriptByShareId, downloadScript } from '../controllers/scriptController.js'
const router = Router()
router.post('/generate', generateScript)
router.get('/:shareId', getScriptByShareId)
router.get('/:shareId/download', downloadScript)
export default router
