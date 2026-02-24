import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true },
    relationship: String,
  },
  { timestamps: true }
);

const Guardian = mongoose.model("Guardian", guardianSchema);

export default Guardian;