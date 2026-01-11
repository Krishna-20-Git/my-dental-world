router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Try to use the AI (Use the 'Lite' model, it is fastest)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("⚠️ AI Error (Quota or Network):", error.message);

    // 2. THE DEMO SAVER: If AI fails, send a polite fallback instead of crashing
    // You can customize these replies for your pitch flow
    let backupReply =
      "I can definitely help with that. Please call our reception at +91 93422 58492 to book an appointment immediately.";

    if (
      req.body.message.toLowerCase().includes("price") ||
      req.body.message.toLowerCase().includes("cost")
    ) {
      backupReply =
        "Our consultation fees start at ₹500. For specific treatments like Root Canals, we need to examine you first. Would you like to book a slot?";
    }

    if (
      req.body.message.toLowerCase().includes("time") ||
      req.body.message.toLowerCase().includes("open")
    ) {
      backupReply =
        "We are open from 10:00 AM to 8:00 PM, Monday through Saturday.";
    }

    // Return the fake response as if it was real
    res.json({ response: backupReply });
  }
});
