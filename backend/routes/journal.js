import express from "express";
import Journal from "../models/Journal.js";

const router = express.Router();


// CREATE
router.post("/", async (req, res) => {
  try {
    const entry = new Journal(req.body);
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const entries = await Journal.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;