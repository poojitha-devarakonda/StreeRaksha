// scripts/seedPlaylist.js
const mongoose = require("mongoose");
const Track = require("../models/TRack");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const AUDIO_FOLDER = path.join(__dirname, "../uploads/audio");

// Valid categories from your model
const VALID_CATEGORIES = ["Calm", "Happy", "Focus", "Sleep", "Motivational"];

const seedFromFolder = async () => {
  console.log("🎵 DYNAMIC PLAYLIST SEEDER");
  console.log("==========================\n");

  // Check if audio folder exists
  if (!fs.existsSync(AUDIO_FOLDER)) {
    console.error(`❌ Audio folder not found: ${AUDIO_FOLDER}`);
    console.log("Creating audio folder...");
    fs.mkdirSync(AUDIO_FOLDER, { recursive: true });
    console.log(`✅ Created folder: ${AUDIO_FOLDER}`);
    console.log("\n📁 Please add your MP3 files to this folder and run again.");
    return;
  }

  // Read all files in audio folder
  const files = fs.readdirSync(AUDIO_FOLDER);
  
  // Filter only MP3 files
  const audioFiles = files.filter(file => 
    file.toLowerCase().endsWith('.mp3')
  );

  if (audioFiles.length === 0) {
    console.error("❌ No MP3 files found in:", AUDIO_FOLDER);
    console.log("\n📁 Please add your MP3 files to:");
    console.log(AUDIO_FOLDER);
    return;
  }

  console.log(`📁 Found ${audioFiles.length} MP3 files:\n`);
  
  // Generate track entries from files
  const tracks = [];
  
  for (let i = 0; i < audioFiles.length; i++) {
    const file = audioFiles[i];
    
    // Extract title from filename (remove .mp3)
    let title = file.replace('.mp3', '');
    
    // Determine category based on filename
    let category = "Calm"; // Default category
    const lowerFile = file.toLowerCase();
    
    if (lowerFile.includes('calm')) category = "Calm";
    else if (lowerFile.includes('happy')) category = "Happy";
    else if (lowerFile.includes('focus')) category = "Focus";
    else if (lowerFile.includes('sleep')) category = "Sleep";
    else if (lowerFile.includes('motivational') || lowerFile.includes('power')) category = "Motivational";
    else if (lowerFile.includes('orange')) category = "Happy"; // Your orange.mp3 -> Happy category
    
    // Clean up title (replace underscores/hyphens with spaces)
    title = title.replace(/[_-]/g, ' ');
    
    // Capitalize words properly
    title = title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Get file stats for duration
    const filePath = path.join(AUDIO_FOLDER, file);
    const stats = fs.statSync(filePath);
    
    // Calculate approximate duration (rough estimate)
    const fileSizeMB = stats.size / (1024 * 1024);
    // Assume ~1MB per minute for MP3
    const durationMin = Math.floor(fileSizeMB);
    const durationSec = Math.floor((fileSizeMB - durationMin) * 60);
    const duration = `${durationMin}:${durationSec.toString().padStart(2, '0')}`;
    
    console.log(`   ${i + 1}. ${file}`);
    console.log(`      → Title: ${title}`);
    console.log(`      → Category: ${category}`);
    console.log(`      → Duration: ${duration}`);
    console.log('');
    
    tracks.push({
      title: title,
      category: category,
      artist: "Wellness Music",
      duration: duration,
      audioUrl: `/uploads/audio/${file}`,
      plays: 0
    });
  }

  console.log("\n📊 Connecting to database...\n");

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/streetraksha");
    console.log("✅ Connected to MongoDB");

    // Clear existing tracks
    await Track.deleteMany({});
    console.log("🗑️ Cleared existing tracks");

    // Insert new tracks
    const result = await Track.insertMany(tracks);
    console.log(`✅ Added ${result.length} tracks to database`);

    // Count by category
    const counts = {};
    result.forEach(track => {
      counts[track.category] = (counts[track.category] || 0) + 1;
    });
    
    console.log("\n📊 Tracks by category:");
    Object.entries(counts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} tracks`);
    });

    // Show categories available
    const availableCategories = [...new Set(result.map(t => t.category))];
    console.log("\n🎵 Available categories:");
    availableCategories.forEach(cat => {
      console.log(`   - ${cat}`);
    });

    await mongoose.disconnect();
    console.log("\n✨ Seeding completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
};

// Run the seeder
seedFromFolder();