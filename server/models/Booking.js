const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true,
  },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  bookingTime: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
