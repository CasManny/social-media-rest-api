import express from 'express'
import { blockUser, deleteUser, followUser, getSingleUserProfile, retrieveBlockedUsers, unBlockUser, unfollowUser, updateUserInfo } from '../controllers/user.controller.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'

const router = express.Router()

// GET USER
router.get("/:userId", getSingleUserProfile)
// GET BLOCKED USERS
router.get("/blockeduser/:userId", retrieveBlockedUsers)
// UPDATE USER 
router.put("/update/:userId", updateUserInfo)
// FOLLOW USER
router.post("/follow/:userId", protectedRoute, followUser)
// UNFOLLOW USER
router.post("/unfollow/:userId", protectedRoute, unfollowUser)
// BLOCK USER
router.post("/blockuser/:userId", protectedRoute, blockUser)
// UNBLOCK USER
router.post("/unblockuser/:userId", protectedRoute, unBlockUser)
// DELETE USER
router.delete("/delete/:userId", deleteUser)
export default router