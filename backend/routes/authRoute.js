import {Router} from "express";
import { login, register, logout, isAuthenticated, verifyOtp, resendOtp, resetPassword, changePassword } from "../controllers/authController.js";
import {passport} from "../services/passport.js";

export const authRoute = Router();

// auth
authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.get('/logout', logout);
authRoute.get('/isAuth', isAuthenticated);

// otp
authRoute.post('/verifyOtp', verifyOtp);
authRoute.post('/resendOtp', resendOtp);

// reset password
authRoute.post('/resetPassword', resetPassword);
authRoute.put('/changePassword', changePassword);