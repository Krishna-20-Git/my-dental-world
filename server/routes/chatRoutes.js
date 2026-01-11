const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const CONTEXT = `
You are the AI Receptionist for "My Dental World", a premium dental clinic in Bangalore.
Your goal is to be helpful, concise, and professional.

DETAILS:
- LOCATIONS: Doddanekundi (Main), Mahadevapura, Whitefield, Medahalli.
- TIMINGS: Mon-Sat (10:00 AM - 09:00 PM), Sun (10:00 AM - 02:00 PM).
- PHONE: +91 93422 58492.
- PHONE (Mahadevapura): +91 79754 24909.
- PHONE (Whitefield): +91 81052 79462.
- PHONE (Medahalli): +91 81470 61084.

RULES FOR ANSWERS:
1. "Skin or Any Other Problems": We DO NOT treat skin/hair. We are strictly a Dental Clinic.
2. "Sunday": Yes, we are open on Sundays, but only from 10:00 AM to 02:00 PM.
3. "Timing": State the full timings clearly (Mon-Sat vs Sun).
4. "Branch/Location": List the 4 branches names only.
5. "Booking": Tell them to use the "Book Now" form on the website.
6. "Price": Consultations are ₹500. Treatments depend on diagnosis.

Keep answers short (max 2 sentences).
`;

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Combine context with user message
    const prompt = `${CONTEXT}\n\nUser: ${message}\nAI:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({
      reply:
        "I'm having trouble checking the schedule. Please call +91 93422 58492.",
    });
  }
});

module.exports = router;
