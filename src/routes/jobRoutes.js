import express from 'express'
import { getJobs, postJob, getJobById, updateJob } from '../controllers/jobController.js'
import requireAuth from '../middleware/authMiddleware.js'

const router = express.Router()
router.get('/jobs', getJobs)
router.post('/jobs', requireAuth, postJob)
router.get('/jobs/:id', getJobById)
router.put('/jobs/:id', requireAuth, updateJob)

export default router
