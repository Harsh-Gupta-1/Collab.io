import express from "express";
import {
  createRoom,
  getRoom,
  updateRoom,
} from "../controllers/roomController.js";
import { protect } from '../middlewares/auth.js';
const router = express.Router();

router.post("/",protect, createRoom);
router.get("/:id", protect, getRoom);
router.put("/:id", updateRoom);

export default router;
