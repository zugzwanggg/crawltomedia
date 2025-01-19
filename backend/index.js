import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import {passport as googlePassport} from "./services/passport.js"
import jwt from "jsonwebtoken";



// routes
import { authRoute } from "./routes/authRoute.js";
import { userRoute } from "./routes/userRoute.js";
import { checkAuth } from "./middlewares/checkAuth.js";
import { mediaRoute } from "./routes/mediaRoute.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: [`${process.env.FRONTEND_BASE_URL}`],
  credentials: true
}

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use('/api', authRoute);
app.use('/api', checkAuth,userRoute);
app.use('/api', checkAuth, mediaRoute);

// oauth2
const JWT_SECRET = process.env.JWT_SECRET || "dev-pass";

app.get('/auth/google', googlePassport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/callback', googlePassport.authenticate('google', {session: false, failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`}), (req,res)=> {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign(req.user, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect(`${process.env.FRONTEND_BASE_URL}}`)
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, async ()=> {
  console.log("App is running at PORT", PORT);
})