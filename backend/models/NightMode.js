import mongoose from "mongoose";

const nightModeSchema = new mongoose.Schema({
 userId: {
  type: String,
  default: "anonymous"
},

  isActive: {
    type: Boolean,
    default: true
  },

  lastCheckIn: {
    type: Date,
    default: Date.now
  },

  interval: {
    type: Number,
    default: 5 // minutes
  }
});

export default mongoose.model("NightMode", nightModeSchema);