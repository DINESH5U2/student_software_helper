import { Router } from 'express'
import { getAllTools, getToolVersions } from '../controllers/toolController.js'
const router = Router()
router.get('/', getAllTools)
router.get('/:slug/versions', getToolVersions)
export default router
