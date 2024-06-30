import jwt from 'jsonwebtoken'

export const generateTokenAndSetTokens = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, //MS
      httponly: true, // prevent XSS attacks cross site scripting attacks
      sameSite: "strict", // CSRF attacks crsos site request forgery attacks
      secure: process.env.NODE_ENV !== "development",
    });
}