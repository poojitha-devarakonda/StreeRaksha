import express from "express";
import { triggerSOS } from "../controllers/SosController.js";

const router = express.Router();

router.post("/trigger", triggerSOS);

export default router;
