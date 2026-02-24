// routes/playlist.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_FOLDER = path.join(__dirname, "../uploads/audio");

// Category mapping based on filename keywords
const getCategoryFromFilename = (filename) => {
  const lower = filename.toLowerCase();
  
  // Calm category - add your calm song keywords
  if (lower.includes('calm') || lower.includes('peace') || lower.includes('relax') || 
      lower.includes('forest') || lower.includes('ocean') || lower.includes('wave') ||
      lower.includes('rain') || lower.includes('river') || lower.includes('meditation'))
    return "Calm";
  
  // Happy category - add your happy song keywords
  if (lower.includes('happy') || lower.includes('joy') || lower.includes('sun') || 
      lower.includes('morning') || lower.includes('upbeat') || lower.includes('dance') ||
      lower.includes('orange'))  // Added 'orange' since you have orange.mp3
    return "Happy";
  
  // Focus category
  if (lower.includes('focus') || lower.includes('study') || lower.includes('work') || 
      lower.includes('concentrate') || lower.includes('beat') || lower.includes('productivity'))
    return "Focus";
  
  // Sleep category
  if (lower.includes('sleep') || lower.includes('night') || lower.includes('dream') || 
      lower.includes('lullaby') || lower.includes('gentle') || lower.includes('rest'))
    return "Sleep";
  
  // Motivational category
  if (lower.includes('power') || lower.includes('motivat') || lower.includes('energy') || 
      lower.includes('inspire') || lower.includes('anthem') || lower.includes('strong'))
    return "Motivational";
  
  // Default - if no keywords match, assign based on first letter to distribute evenly
  const firstChar = lower.charAt(0);
  if (['a', 'b', 'c', 'd'].includes(firstChar)) return "Calm";
  if (['e', 'f', 'g', 'h'].includes(firstChar)) return "Happy";
  if (['i', 'j', 'k', 'l'].includes(firstChar)) return "Focus";
  if (['m', 'n', 'o', 'p'].includes(firstChar)) return "Sleep";
  return "Motivational";
};

// Get all songs (for debugging)
router.get("/all", (req, res) => {
  try {
    const files = fs.readdirSync(AUDIO_FOLDER);
    const songs = files
      .filter(file => file.endsWith('.mp3'))
      .map((file, index) => ({
        id: index + 1,
        title: file.replace('.mp3', '').replace(/_/g, ' '),
        category: getCategoryFromFilename(file),
        url: `/uploads/audio/${file}`,
        artist: "Wellness Music",
        duration: "3:30"
      }));
    console.log("📊 All songs:", songs.map(s => `${s.title} (${s.category})`));
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get("/categories", (req, res) => {
  res.json(["Calm", "Happy", "Focus", "Sleep", "Motivational"]);
});

// Get tracks by category
router.get("/:category", (req, res) => {
  try {
    const { category } = req.params;
    const files = fs.readdirSync(AUDIO_FOLDER);
    
    // Filter MP3 files
    const mp3Files = files.filter(file => file.endsWith('.mp3'));
    
    // Categorize each file and filter by requested category
    const tracks = mp3Files
      .filter(file => getCategoryFromFilename(file) === category)
      .map((file, index) => ({
        _id: `track-${Date.now()}-${index}`,
        title: file.replace('.mp3', '').replace(/_/g, ' '),
        category: category,
        artist: "Wellness Music",
        duration: "3:30",
        audioUrl: `/uploads/audio/${file}`
      }));
    
    console.log(`🎵 ${category}: ${tracks.length} tracks`);
    res.json(tracks);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;