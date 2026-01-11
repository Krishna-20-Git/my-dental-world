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
    // 2. TRY REAL AI FIRST
    // Use experimental model for best chance of free access
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.json({ response: text });
  } catch (error) {
    console.error("⚠️ AI Failed (Quota/Network) - Using Backup Logic");

    // 3. BACKUP MODE (Manually programmed answers)
    const lowerCaseMsg = userMessage.toLowerCase();

    // Default fallback
    let backupReply =
      "I am currently experiencing high traffic. Please call us directly at +91 93422 58492.";

    // --- KEYWORD MATCHING ---

    // BRANCHES / LOCATION / ADDRESS
    if (
      lowerCaseMsg.includes("location") ||
      lowerCaseMsg.includes("address") ||
      lowerCaseMsg.includes("branch") ||
      lowerCaseMsg.includes("where")
    ) {
      backupReply = `We have 4 convenient locations in Bengaluru:

1. 📍 **Doddanekundi (Main)**
Shop No:50, A.N.M Krishna Reddy Layout, Opp Alpine Eco Apt.
📞 9342258492

2. 📍 **Mahadevapura**
Shop No: 5, YSR Skyline, Venkateshwara Layout.
📞 7975424909

3. 📍 **Whitefield**
Shop No. 7, ECC Road, Next to Yuken India Ltd.
📞 8105279462

4. 📍 **Medahalli**
No.42, Kamashree Layout, Near Big Day Super Market.
📞 8147061084`;
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
      lowerCaseMsg.includes("jha") ||
      lowerCaseMsg.includes("shalindra") ||
      lowerCaseMsg.includes("shailendra")
    ) {
      backupReply =
        "Dr. Shailendra Jha is our Chief Dental Surgeon. He has over 15 years of experience specializing in Root Canals and Cosmetic Dentistry.";
    }

    // PRICE / COST
    else if (
      lowerCaseMsg.includes("price") ||
      lowerCaseMsg.includes("cost") ||
      lowerCaseMsg.includes("money") ||
      lowerCaseMsg.includes("fees")
    ) {
      backupReply =
        "Our consultation fee is ₹500. Treatment costs (like RCT or Braces) vary based on the patient's condition. Would you like to book a checkup?";
    }

    // APPOINTMENT
    else if (
      lowerCaseMsg.includes("book") ||
      lowerCaseMsg.includes("appointment")
    ) {
      backupReply =
        "I can help with that. Please call our main line at +91 93422 58492 to book a slot.";
    }

    // GREETINGS
    else if (
      lowerCaseMsg.includes("hi") ||
      lowerCaseMsg.includes("hello") ||
      lowerCaseMsg.includes("hey")
    ) {
      backupReply =
        "Hello! Welcome to My Dental World. Ask me about our locations, doctors, or timings!";
    }

    return res.json({ response: backupReply });
  }
});

module.exports = router;
