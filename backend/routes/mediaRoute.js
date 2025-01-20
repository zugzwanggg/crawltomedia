import {Router} from "express";
import { connectToInstagram, getStatistics } from "../controllers/mediaController.js";

export const mediaRoute = Router();

mediaRoute.get('api/getStatistics/:user_id', getStatistics);
mediaRoute.get('auth/instagram/callback', connectToInstagram);