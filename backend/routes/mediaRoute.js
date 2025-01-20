import {Router} from "express";
import { connectToInstagram, disconnectUserApp, getStatistics } from "../controllers/mediaController.js";
import {passport as googlePassport} from "../services/passport.js"
import { checkAuth } from "../middlewares/checkAuth.js";

import jwt from "jsonwebtoken";

export const mediaRoute = Router();

mediaRoute.delete('/api/disconnectApp/:user_id', disconnectUserApp);

mediaRoute.get('/api/getStatistics/:user_id', checkAuth, getStatistics);
mediaRoute.get('/auth/instagram/callback', checkAuth, connectToInstagram);

mediaRoute.get('/auth/google', googlePassport.authenticate('google', {scope: ['profile', 'email']}));
mediaRoute.get('/auth/google/callback', googlePassport.authenticate('google', {session: false, failureRedirect: `${process.env.FRONTEND_BASE_URL}/login`}), (req,res)=> {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign(req.user, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    });
    res.redirect(`${process.env.FRONTEND_BASE_URL}`)
})