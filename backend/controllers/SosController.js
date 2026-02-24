import { sendSOSAlert } from "../services/twilio.service.js";

export const triggerSOS = async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Location required" });
  }

  const locationLink = `https://maps.google.com/?q=${lat},${lng}`;

  try {
    const result = await sendSOSAlert(locationLink);

    res.json({
      success: true,
      message: "SOS triggered",
      result,
    });
  } catch (err) {
    console.error("SOS Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to trigger SOS",
    });
  }
};
