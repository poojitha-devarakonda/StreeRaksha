import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import tripRoutes from "./routes/tripRoutes.js";
import sosRoutes from "./routes/SosRoutes.js";
import authRoutes from "./routes/auth.js";
// import reportRoutes from "./routes/reports.js";
import guardianRoutes from "./routes/guardian.js";
import journalRoutes from "./routes/journal.js";
import trackRoutes from "./routes/track.js";
import playlistRoutes from "./routes/playlist.js";

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads/audio", express.static(path.join(__dirname, "uploads/audio")));

// Routes
app.use("/api/trips", tripRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/reports", reportRoutes);
app.use("/api/guardian", guardianRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/playlists", playlistRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo error:", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});