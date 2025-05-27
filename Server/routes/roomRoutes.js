import express from "express";
import {
  createRoom,
  getRoom,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/", createRoom);
router.get("/:id", getRoom);
router.put("/:id", updateRoom);

export default router;
