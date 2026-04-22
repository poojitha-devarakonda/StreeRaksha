import express from "express";
import { startTrip, updateLocation } from "../controllers/tripController.js";

const router = express.Router();

router.post("/start", startTrip);
router.post("/location", updateLocation);

export default router;
