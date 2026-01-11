const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "MissingKey");

router.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  // 1. INPUT CHECK
  if (!userMessage) {
    return res.json({
      response: "Hello! I am your Dental Assistant. How can I help?",
    });
  }

  try {
    // 2. TRY REAL AI FIRST (Using the Experimental model for best chance of free access)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    // If AI works, send the real answer
    return res.json({ response: text });
  } catch (error) {
    console.error("⚠️ AI Failed (Quota/Network) - Using Backup Logic");

    // 3. BACKUP MODE (If AI fails, we answer manually)
    const lowerCaseMsg = userMessage.toLowerCase();

    // Default fallback if no keywords match
    let backupReply =
      "I am currently experiencing high traffic. Please call us directly at +91 93422 58492 for immediate assistance.";

    // --- KEYWORD MATCHING ---

    // GREETINGS
    if (
      lowerCaseMsg.includes("hi") ||
      lowerCaseMsg.includes("hello") ||
      lowerCaseMsg.includes("hey")
    ) {
      backupReply =
        "Hello! Welcome to My Dental World. I can help with appointments, timings, and clinic details.";
    }

    // TIME / OPEN / SUNDAY
    else if (
      lowerCaseMsg.includes("time") ||
      lowerCaseMsg.includes("open") ||
      lowerCaseMsg.includes("hour") ||
      lowerCaseMsg.includes("sunday")
    ) {
      backupReply =
        "We are open Monday to Saturday from 10:00 AM to 8:00 PM. On Sundays, we are open for emergency appointments only (10:00 AM - 1:00 PM).";
    }

    // DOCTOR INFO
    else if (
      lowerCaseMsg.includes("doctor") ||
      lowerCaseMsg.includes("who") ||
      lowerCaseMsg.includes("jha") ||
      lowerCaseMsg.includes("shalindra") ||
      lowerCaseMsg.includes("shailendra")
    ) {
      backupReply =
        "Dr. Shailendra Jha is our Chief Dental Surgeon. He has over 15 years of experience specializing in Root Canals and Cosmetic Dentistry.";
    }

    // LOCATION / ADDRESS
    else if (
      lowerCaseMsg.includes("location") ||
      lowerCaseMsg.includes("where") ||
      lowerCaseMsg.includes("address") ||
      lowerCaseMsg.includes("located")
    ) {
      backupReply =
        "We are located at Plot No. 45, Sector 12, near City Center Mall. You can find us on Google Maps as 'My Dental World'.";
    }

    // PRICE / COST
    else if (
      lowerCaseMsg.includes("price") ||
      lowerCaseMsg.includes("cost") ||
      lowerCaseMsg.includes("money") ||
      lowerCaseMsg.includes("fees")
    ) {
      backupReply =
        "Our consultation fee is ₹500. Treatment costs (like RCT or Braces) vary based on the patient's condition.";
    }

    // APPOINTMENT
    else if (
      lowerCaseMsg.includes("book") ||
      lowerCaseMsg.includes("appointment")
    ) {
      backupReply =
        "I can help with that. Please call +91 93422 58492 or use the 'Book Now' button on our website.";
    }

    return res.json({ response: backupReply });
  }
});

module.exports = router;
