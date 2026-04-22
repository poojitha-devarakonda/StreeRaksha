// routes/track.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Get all tracks (list all MP3 files)
router.get("/", (req, res) => {
  const audioDir = path.join(__dirname, "../uploads/audio");

  fs.readdir(audioDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Error reading audio folder" });

    const tracks = files
      .filter(file => file.endsWith(".mp3"))
      .map((file, index) => ({
        id: index + 1,
        title: file.replace(".mp3", "").replace(/_/g, " "), // Convert underscores to spaces
        file: `/uploads/audio/${file}`
      }));

    res.json(tracks);
  });
});

export default router;