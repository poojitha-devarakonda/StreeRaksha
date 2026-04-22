import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  mood: String,
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;