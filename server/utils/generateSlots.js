const Slot = require("../models/Slot");

const CLINIC_CONFIG = {
  branches: [1, 2, 3, 4],
  bookingWindowDays: 7,
  timings: {
    weekday: { start: 10, end: 21 }, // 10 AM - 9 PM
    sunday: { start: 10, end: 14 }, // 10 AM - 2 PM
  },
};

const generateSlots = async () => {
  console.log("⚙️  Generating slots for all 4 branches...");
  const today = new Date();

  for (let i = 0; i < CLINIC_CONFIG.bookingWindowDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const isSunday = date.getDay() === 0;

    const startHour = isSunday
      ? CLINIC_CONFIG.timings.sunday.start
      : CLINIC_CONFIG.timings.weekday.start;
    const endHour = isSunday
      ? CLINIC_CONFIG.timings.sunday.end
      : CLINIC_CONFIG.timings.weekday.end;

    // Generate time strings strictly chronologically
    const times = [];
    for (let h = startHour; h < endHour; h++) {
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h > 12 ? h - 12 : h;
      const formattedHour = displayHour.toString().padStart(2, "0");

      // Fix for 12 PM
      const timeString = h === 12 ? `12:00 PM` : `${formattedHour}:00 ${ampm}`;
      times.push(timeString);
    }

    for (const branchId of CLINIC_CONFIG.branches) {
      for (const time of times) {
        // Create if not exists
        const exists = await Slot.findOne({ date: dateStr, time, branchId });
        if (!exists) {
          try {
            await Slot.create({
              branchId,
              date: dateStr,
              time,
              status: "open",
            });
          } catch (e) {}
        }
      }
    }
  }
  console.log("✨ Slot generation complete.");
};

module.exports = generateSlots;
