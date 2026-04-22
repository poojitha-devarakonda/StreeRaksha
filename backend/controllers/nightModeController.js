import NightMode from "../models/NightMode.js";
import User from "../models/User.js";
import { notifyNearbyUsers } from "../services/communityServices.js";

export const startNightMode = async (req, res) => {
  const { userId } = req.body;

  try {
    const session = await NightMode.create({ userId });

    res.json({
      message: "Night mode activated",
      session
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// user clicks "I’m Safe"
export const checkIn = async (req, res) => {
  const { userId } = req.body;

  try {
    await NightMode.findOneAndUpdate(
      { userId, isActive: true },
      { lastCheckIn: new Date() }
    );

    res.json({ message: "Check-in updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// stop night mode
export const stopNightMode = async (req, res) => {
  const { userId } = req.body;

  await NightMode.findOneAndUpdate(
    { userId },
    { isActive: false }
  );

  res.json({ message: "Night mode stopped" });
};