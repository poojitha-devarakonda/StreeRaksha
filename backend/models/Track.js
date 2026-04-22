import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ["Calm", "Happy", "Focus", "Sleep", "Motivational"]
  },
  artist: { 
    type: String, 
    default: "Unknown Artist" 
  },
  duration: { 
    type: String, 
    default: "3:30" 
  },
  audioUrl: { 
    type: String, 
    required: true 
  },
  plays: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Track = mongoose.model("Track", trackSchema);

export default Track;