const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

// --- 📧 EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "krishnadpsranchi@gmail.com", // YOUR LOGIN
    pass: "kwrh tfvi vhnw kzjb", // YOUR APP PASSWORD
  },
  family: 4, // Force IPv4
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

// --- 🛑 BOOKING ROUTE (FIXED) 🛑 ---
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

   await Booking.create({
     slotId: slot._id,
     patientName: name,
     patientPhone: phone,
   });

    // Get Branch Info
    const branchInfo = BRANCH_DETAILS[slot.branchId] || BRANCH_DETAILS[1];

    // --- 📧 1. EMAIL TO PATIENT ---
    const patientMailOptions = {
      from: '"My Dental World" <krishnadpsranchi@gmail.com>',
      replyTo: "kz8457@srmist.edu.in",
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

Need to Reschedule?
📞 Clinic Phone: +91 ${branchInfo.phone}

Warm Regards,
Dr. Shailendra Jha & Team`,
    };

    // --- 📧 2. EMAIL TO CLINIC/RECEPTION (Demo) ---
    const clinicMailOptions = {
      from: '"My Dental World System" <krishnadpsranchi@gmail.com>',
      to: "kz8457@srmist.edu.in", // <--- YOUR EMAIL FOR DEMO
      subject: `🔔 NEW BOOKING: ${name} (${branchInfo.name})`,
      text: `*** NEW PATIENT ALERT ***

A new appointment has been booked via the website.

👤 Patient Name: ${name}
📞 Phone: ${phone}
🏥 Branch: ${branchInfo.name}
📅 Date: ${slot.date}
⏰ Time: ${slot.time}
🦷 Service: ${service}

Please update the clinic register accordingly.`,
    };

    // --- ⚡ THE FIX: WAIT FOR EMAILS ---
    // This forces the server to wait until Google accepts the emails
    try {
      await Promise.all([
        transporter.sendMail(patientMailOptions),
        transporter.sendMail(clinicMailOptions),
      ]);
      console.log("✅ Both emails sent successfully!");
    } catch (emailError) {
      console.error("⚠️ Email sending failed:", emailError.message);
      // We still allow the booking to complete even if email fails,
      // but we log it so you know.
    }

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
