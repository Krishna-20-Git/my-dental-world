const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  branchId: { type: Number, required: true }, // 1, 2, 3, 4
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // 10:00 AM
  status: { type: String, enum: ["open", "booked"], default: "open" },

  // Patient Details
  patientName: { type: String, default: "" },
  patientEmail: { type: String, default: "" },
  patientPhone: { type: String, default: "" },
  serviceType: { type: String, default: "" },
});

// COMPOUND INDEX: Allows 10:00 AM to exist multiple times, BUT only once per branch per day.
slotSchema.index({ branchId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);
