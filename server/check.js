require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.GEMINI_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function getModels() {
  console.log("🔍 Asking Google for available models...");
  try {
    const res = await axios.get(URL);
    console.log("\n✅ SUCCESS! Here are your available models:");

    // Filter and print only the names
    const names = res.data.models.map((m) => m.name.replace("models/", ""));
    console.log(names.join("\n"));
  } catch (err) {
    console.error("❌ ERROR:", err.response ? err.response.data : err.message);
  }
}

getModels();
