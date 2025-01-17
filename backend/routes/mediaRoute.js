import {Router} from "express";
import { getStatistics } from "../controllers/mediaController.js";

export const mediaRoute = Router();

mediaRoute.get('/getStatistics/:user_id', getStatistics)