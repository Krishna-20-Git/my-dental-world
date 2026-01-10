const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const generateSlots = require("./utils/generateSlots");

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api", chatRoutes);

// Connect DB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // 🛑 REMOVED THE DROP COMMAND SO DATA IS SAVED 🛑
    // (We only needed that once to fix the index error)

    // Check & Generate slots if missing
    await generateSlots();

    app.listen(5000, () => {
      console.log(`🚀 Server running on port 5000`);
    });
  })
  .catch((err) => console.error("❌ Database Connection Error:", err));
