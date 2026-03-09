import { Router } from 'express'
import { getAllToolsAdmin, createTool, updateTool, deleteTool } from '../controllers/adminController.js'
import { adminAuth } from '../middleware/adminAuth.js'
const router = Router()
router.use(adminAuth)
router.get('/tools', getAllToolsAdmin)
router.post('/tools', createTool)
router.put('/tools/:id', updateTool)
router.delete('/tools/:id', deleteTool)
export default router
