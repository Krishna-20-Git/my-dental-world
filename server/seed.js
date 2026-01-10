require("dotenv").config();
const mongoose = require("mongoose");
const Slot = require("./models/Slot");

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB");

    // 1. CLEAR OLD DATA
    await Slot.deleteMany({});
    console.log("🧹 Cleared old slots!");

    const slots = [];

    // 2. LOOP FOR THE NEXT 7 DAYS
    for (let day = 0; day < 7; day++) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + day); // Move forward by 'day' days
      const dateString = dateObj.toISOString().split("T")[0]; // "2026-01-08"

      // Create slots from 9 AM to 5 PM for this specific day
      for (let hour = 9; hour < 17; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`;

        slots.push({
          date: dateString,
          time: timeString,
          status: "available",
        });
      }
    }

    // 3. SAVE ALL
    await Slot.insertMany(slots);
    console.log(`✨ Successfully added slots for the next 7 days!`);

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

seedDB();
