const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

// --- 📧 EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "krishnadpsranchi@gmail.com",
    pass: "kwrh tfvi vhnw kzjb",
  },
});

// --- 🏥 BRANCH DATA (With Specific Phone Numbers) ---
const BRANCH_DETAILS = {
  1: {
    name: "Doddanekundi (Main)",
    address: "Shop No:50, A.N.M Krishna Reddy Layout, Opp Alpine Eco Apt.",
    phone: "9342258492",
  },
  2: {
    name: "Mahadevapura",
    address: "Shop No: 5, YSR Skyline, Venkateshwara Layout.",
    phone: "7975424909",
  },
  3: {
    name: "Whitefield",
    address: "Shop No. 7, 131, Ecc Road, Next to Yuken India Ltd.",
    phone: "8105279462",
  },
  4: {
    name: "Medahalli",
    address: "No.42, Kamashree Layout, Near Big Day Super Market.",
    phone: "8147061084",
  },
};

// Helper: Sort times correctly
const timeToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours, 10) + 12;
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

// GET SLOTS
router.get("/slots", async (req, res) => {
  try {
    const { date, branchId } = req.query;
    if (!date || !branchId)
      return res.status(400).json({ message: "Missing data" });

    const slots = await Slot.find({ date, branchId: parseInt(branchId) });
    const sortedSlots = slots.sort(
      (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
    );
    res.json(sortedSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 🛑 BOOKING ROUTE 🛑 ---
router.post("/book/:id", async (req, res) => {
  try {
    const { name, email, phone, service } = req.body;
    const slot = await Slot.findById(req.params.id);

    if (!slot || slot.status !== "open") {
      return res.status(400).json({ message: "Slot unavailable" });
    }

    // Update Slot
    slot.status = "booked";
    slot.patientName = name;
    slot.patientEmail = email;
    slot.patientPhone = phone;
    slot.serviceType = service;
    await slot.save();

    // Create Booking Record
    await Booking.create({
      slotId: slot._id,
      patientName: name,
      patientPhone: phone,
    });

    // Get Branch Info
    // Default to Main branch if ID is missing for some reason
    const branchInfo = BRANCH_DETAILS[slot.branchId] || BRANCH_DETAILS[1];

    // --- 📧 EMAIL CONTENT (Treatment Removed, Dynamic Phone Added) ---
    const mailOptions = {
      from: '"My Dental World" <jhashailendra1979@gmail.com>',
      to: email,
      subject: `Appointment Confirmed: ${slot.date}`,
      text: `Hello ${name},

We are pleased to confirm your appointment at My Dental World.

Your Appointment Details:
----------------------------------------
📅 Date: ${slot.date}
⏰ Time: ${slot.time}
🏥 Clinic: ${branchInfo.name}
📍 Address: ${branchInfo.address}

Important Information:
----------------------------------------
• Please arrive 10 minutes early to complete any necessary paperwork.
• No special preparation is required for this consultation.
• If you are feeling anxious, please let us know—we are here to make you comfortable.

Need to Reschedule?
If you need to change your appointment, please call this clinic directly:
📞 Clinic Phone: +91 ${branchInfo.phone}
✉️ Email: jhashailendra1979@gmail.com

We look forward to taking care of your smile!

Warm Regards,
Dr. Shailendra Jha & Team
My Dental World`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.log("⚠️ Email failed:", err.message);
      else console.log("✅ Email sent to", email);
    });

    res.json({ message: "Booked", slot });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ADMIN ROUTE
router.get("/admin", async (req, res) => {
  try {
    const { key, branchId } = req.query;
    const validKeys = ["doctor123", "branch1", "branch2", "branch3", "branch4"];
    if (!validKeys.includes(key)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let bookings = await Booking.find()
      .populate("slotId")
      .sort({ bookingTime: -1 });

    if (branchId && branchId !== "all") {
      bookings = bookings.filter(
        (b) => b.slotId && b.slotId.branchId === parseInt(branchId)
      );
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
