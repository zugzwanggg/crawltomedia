import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

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
app.use('/', mediaRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async ()=> {
  console.log("App is running at PORT", PORT);
})