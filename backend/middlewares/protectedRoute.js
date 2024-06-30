import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
export const protectedRoute = async (req, res, next) => {
    const token = req.cookies.jwt 
    if (!token) {
        return res.status(404).json({error: "token not found"})
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({error: "User not found"})
    }
    req.user = user
    next()
}