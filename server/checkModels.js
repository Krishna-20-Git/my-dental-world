require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Using a trick to fetch available models via the API directly isn't exposed simply in the helper,
// so let's try to infer it from the error.

console.log("--------------------------------------");
console.log("Your API Key is loaded:", process.env.GEMINI_KEY ? "YES" : "NO");
console.log("Please copy the error message from the main server terminal.");
console.log("--------------------------------------");
