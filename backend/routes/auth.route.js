import express from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'

const router = express.Router()

// REGISTER USER
router.post("/register", registerUser)

// LOGIN USER
router.post("/login", loginUser)

// LOGOUT USER
router.get('/logout', logoutUser)

// FETCH CURRENT USER
router.get("/profile", protectedRoute, getUserProfile)

export default router
