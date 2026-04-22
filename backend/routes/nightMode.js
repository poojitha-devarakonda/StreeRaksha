import express from "express";
import {
  startNightMode,
  checkIn,
  stopNightMode
} from "../controllers/nightModeController.js";

const router = express.Router();

router.post("/start", startNightMode);
router.post("/checkin", checkIn);
router.post("/stop", stopNightMode);

export default router;