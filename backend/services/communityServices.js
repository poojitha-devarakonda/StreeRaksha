import twilio from "twilio";
import User from "../models/User.js";
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

export const notifyNearbyUsers = async (lat, lng, type = "SOS") => {
  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 2000
        }
      },
      communityOptIn: true
    });

    const message = `🚨 ${type} ALERT 🚨
Location: https://maps.google.com/?q=${lat},${lng}`;

    for (let user of users) {
      if (!user.phone) continue;

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: user.phone
      });
    }

    console.log("Community alerts sent");
  } catch (err) {
    console.error(err);
  }
};