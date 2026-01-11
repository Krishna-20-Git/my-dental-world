require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function check() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  try {
    console.log("Fetching available models...");
    const result = await genAI.getGenerativeModel({ model: "gemini-pro" })
      .apiKey; // Just checks key
    // Actually list the models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_KEY}`
    );
    const data = await response.json();

    if (data.models) {
      console.log("\n--- AVAILABLE MODELS ---");
      data.models.forEach((m) => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          // Filter for "Pro" or "Flash" models only
          if (m.name.includes("gemini")) {
            console.log(m.name.replace("models/", ""));
          }
        }
      });
      console.log("------------------------\n");
    } else {
      console.log("Error:", data);
    }
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

check();
