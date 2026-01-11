const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

router.post("/chat", async (req, res) => {
  // 1. INPUT CHECK: Stop crashes if message is empty
  const userMessage = req.body.message || "";

  if (!userMessage) {
    return res.json({ response: "Hello! How can I help you today?" });
  }

  try {
    // 2. AI ATTEMPT
    // Use the reliable "Lite" model for speed
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.json({ response: text });
  } catch (error) {
    console.error("⚠️ AI Failed - Switching to Backup Mode:", error.message);

    // 3. SAFE BACKUP SYSTEM (The Demo Saver)
    const lowerCaseMsg = userMessage.toLowerCase();
    let backupReply =
      "I can definitely help with that. Please call our reception at +91 93422 58492 to book an appointment.";

    // Smart Keywords (Add more if you want)
    if (
      lowerCaseMsg.includes("price") ||
      lowerCaseMsg.includes("cost") ||
      lowerCaseMsg.includes("fee")
    ) {
      backupReply =
        "Our consultation fees start at ₹500. Specific treatments depend on the doctor's examination.";
    }

    if (
      lowerCaseMsg.includes("time") ||
      lowerCaseMsg.includes("open") ||
      lowerCaseMsg.includes("schedule")
    ) {
      backupReply =
        "We are open from 10:00 AM to 8:00 PM, Monday through Saturday.";
    }

    if (lowerCaseMsg.includes("root canal") || lowerCaseMsg.includes("rct")) {
      backupReply =
        "Root Canal Treatments are our specialty. The procedure is painless and usually takes 2 sittings.";
    }

    if (lowerCaseMsg.includes("hi") || lowerCaseMsg.includes("hello")) {
      backupReply =
        "Hello! I am the Dental Assistant for My Dental World. How can I help you?";
    }

    // Send the backup reply safely
    return res.json({ response: backupReply });
  }
});

module.exports = router;
