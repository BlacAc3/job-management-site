import express from 'express'
import { registerUser, loginUser  } from '../controllers/auth.js'

const router = express.Router()

// router.get()
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);


export default router
