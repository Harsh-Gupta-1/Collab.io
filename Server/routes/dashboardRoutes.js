import express from "express";
import { getUserRooms } from "../controllers/dashboardController.js";
import { protect } from '../middlewares/auth.js';
const router = express.Router();
router.get("/",protect, getUserRooms);

export default router;  