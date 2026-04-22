import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (locationLink) => {
  return client.messages.create({
    body: `🚨 SOS ALERT!\nLive Location: ${locationLink}`,
    from: process.env.TWILIO_PHONE,
    to: process.env.GUARDIAN_PHONE
  });
};