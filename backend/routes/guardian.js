import express from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";
import Guardian from "../models/Guardian.js";

const router = express.Router();

// Temporary memory store
let pendingGuardians = {};


// Helper to create transporter only when needed
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// OTP validity time (120 seconds)
const OTP_EXPIRY = 120 * 1000;

// ---------------- SEND / RESEND OTP ----------------
router.post("/send-otp", async (req, res) => {
  try {
    const { name, phone, email, relationship } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    pendingGuardians[email] = {
      name,
      phone,
      email,
      relationship,
      otp,
      expiresAt: Date.now() + OTP_EXPIRY,
    };

    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Guardian OTP Verification",
      text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const guardianData = pendingGuardians[email];

    if (!guardianData) {
      return res.status(400).json({ message: "No pending guardian found" });
    }

    if (Date.now() > guardianData.expiresAt) {
      delete pendingGuardians[email];
      return res.status(400).json({ message: "OTP expired. Please resend." });
    }

    if (guardianData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const newGuardian = new Guardian({
      name: guardianData.name,
      phone: guardianData.phone,
      email: guardianData.email,
      relationship: guardianData.relationship,
    });

    await newGuardian.save();
    delete pendingGuardians[email];

    res.json({ message: "Guardian verified & saved successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET GUARDIANS ----------------
router.get("/", async (req, res) => {
  try {
    const guardians = await Guardian.find().sort({ createdAt: -1 });
    res.json(guardians);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE GUARDIAN ----------------
router.delete("/:id", async (req, res) => {
  try {
    await Guardian.findByIdAndDelete(req.params.id);
    res.json({ message: "Guardian deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- SOS ALERT ----------------
router.post("/sos", async (req, res) => {
  try {
    const { location } = req.body;

    const guardians = await Guardian.find();

    if (!guardians.length) {
      return res.status(400).json({ message: "No guardians found" });
    }

    const mode = process.env.NOTIFY_MODE;
    const transporter = createTransporter();

    // ✅ CREATE TWILIO CLIENT HERE (after env is loaded)
    const twilioClient = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    console.log("SOS HIT | Mode:", mode);

    for (const g of guardians) {

      // 📧 EMAIL
      if (mode === "email" || mode === "both") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: g.email,
          subject: "🚨 SOS Emergency Alert",
          text: `🚨 EMERGENCY ALERT 🚨

User may be in danger.

Live Location:
${location || "Location unavailable"}

Please contact them immediately.`,
        });
      }

      // 📱 SMS
      if ((mode === "sms" || mode === "both") && g.phone) {
        console.log("Sending SMS to:", g.phone);

        await twilioClient.messages.create({
          body: `🚨 SOS ALERT!\nUser may be in danger.\nLocation: ${location}`,
          from: process.env.TWILIO_PHONE,
          to: g.phone,
        });
      }
    }

    res.json({
      message: `SOS sent via ${mode}`,
      count: guardians.length,
    });

  } catch (err) {
    console.error("SOS error:", err);
    res.status(500).json({ message: "Failed to send SOS alert" });
  }
  
});

export default router;