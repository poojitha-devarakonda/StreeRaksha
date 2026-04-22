import NightMode from "../models/NightMode.js";
import User from "../models/User.js";
import { notifyNearbyUsers } from "./communityServices.js";
import axios from "axios";
export const monitorNightMode = () => {
  setInterval(async () => {
    try {
      const sessions = await NightMode.find({ isActive: true });

      const now = new Date();

      for (let session of sessions) {
        const diff =
          (now - new Date(session.lastCheckIn)) / (1000 * 60);
if (diff > session.interval) {

  // ✅ skip invalid userId
  if (!session.userId || session.userId.length !== 24) {
    // console.log("Skipping invalid userId:", session.userId);
    continue;
  }

  // ✅ fetch user once
  const user = await User.findById(session.userId);
  if (!user) continue;

  const [lng, lat] = user.location.coordinates;

  console.log("⚠️ No response, triggering NIGHT SOS");

  await notifyNearbyUsers(lat, lng, "NIGHT ALERT");

  await axios.post("http://localhost:5050/api/guardian/sos", {
    location: `https://www.google.com/maps?q=${lat},${lng}`,
  });

  // reset timer so it doesn’t spam
  session.lastCheckIn = new Date();
  await session.save();
}
      }
    } catch (err) {
      console.error("NightMode Error:", err.message);
    }
  }, 60000); // runs every 1 min
};