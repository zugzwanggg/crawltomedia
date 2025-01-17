import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "dev-pass"

export const checkAuth = async (req,res,next) => {
  try {
    
    const token = req.cookies.token;

    if (!token) return res.status(403).json({
      message: 'Unauthorized'
    })

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.log('Error at checkAuth:', error);
    res.status(500).json(error)
  }
}