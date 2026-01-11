const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");

// --- 📧 EMAIL CONFIGURATION (Updated with New Password) ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL Port (Best for Cloud/Render)
  secure: true, // True for 465
  auth: {
    user: "krishnadpsranchi@gmail.com",
    pass: "coan twfp ppyb peck", // <--- NEW PASSWORD (Revoke after demo!)
  },
  family: 4, // Force IPv4 to prevent connection timeouts
});

// --- 🏥 BRANCH DATA ---
const BRANCH_DETAILS = {
  1: {
    name: "Doddanekundi (Main)",
    address: "Shop No:50, A.N.M Krishna Reddy Layout",
    phone: "9342258492",
  },
  2: {
    name: "Mahadevapura",
    address: "Shop No: 5, YSR Skyline",
    phone: "7975424909",
  },
  3: {
    name: "Whitefield",
    address: "Shop No. 7, ECC Road",
    phone: "8105279462",
  },
  4: {
    name: "Medahalli",
    address: "No.42, Kamashree Layout",
    phone: "8147061084",
  },
};

// --- GET SLOTS ROUTE ---
const timeToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours, 10) + 12;
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

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

// --- 🛑 BOOKING ROUTE (Network Fix Added) 🛑 ---
router.post("/book/:id", async (req, res) => {
  try {
    const { name, email, phone, service } = req.body;
    
    // 1. DATABASE LOGIC
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

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

    const branchInfo = BRANCH_DETAILS[slot.branchId] || BRANCH_DETAILS[1];

    // 2. ⚡ RESPOND TO APP IMMEDIATELY ⚡
    res.json({ message: "Booked", slot });

    // 3. SEND EMAIL IN BACKGROUND (With IPv4 Fix)
    const sendEmail = async () => {
      try {
        const demoTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "krishnadpsranchi@gmail.com", 
            pass: "coan twfp ppyb peck" 
          },
          family: 4 // <--- THIS IS THE MAGIC FIX FOR TIMEOUTS
        });

        const mailOptions = {
          from: '"My Dental World" <krishnadpsranchi@gmail.com>',
          to: email, 
          subject: `Appointment Confirmed: ${slot.date}`,
          text: `Hello ${name},\n\nYour appointment at ${branchInfo.name} is confirmed.\nDate: ${slot.date}\nTime: ${slot.time}`
        };

        const clinicOptions = {
          from: '"Dental System" <krishnadpsranchi@gmail.com>',
          to: "kz8457@srmist.edu.in",
          subject: `🔔 NEW BOOKING: ${name}`,
          text: `New Booking:\n${name}\n${phone}\n${branchInfo.name}`
        };

        await Promise.all([
            demoTransporter.sendMail(mailOptions),
            demoTransporter.sendMail(clinicOptions)
        ]);
        console.log("✅ Email sent successfully in background");

      } catch (emailErr) {
        console.error("⚠️ Email failed (but booking is safe):", emailErr.message);
      }
    };
    
    sendEmail();

  } catch (err) {
    console.error("Database Error:", err);
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
});

// --- 🛠️ RESET ROUTE (Use this if you get "Unable to book") ---
// URL: https://my-dental-api.onrender.com/api/appointments/reset-slots
router.get("/reset-slots", async (req, res) => {
  try {
    await Slot.updateMany(
      {},
      {
        $set: {
          status: "open",
          patientName: null,
          patientEmail: null,
          patientPhone: null,
          serviceType: null,
        },
      }
    );
    await Booking.deleteMany({});
    res.send("✅ System Reset Successful. Refresh your app.");
  } catch (err) {
    res.status(500).send("Reset Failed: " + err.message);
  }
});

module.exports = router;
