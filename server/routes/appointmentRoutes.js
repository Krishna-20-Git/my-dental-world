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
    user: process.env.EMAIL_USER, // Reads from .env
    pass: process.env.EMAIL_PASS, // Reads from .env
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

// --- 🛑 BOOKING ROUTE (Demo Safe Version) 🛑 ---
router.post("/book/:id", async (req, res) => {
  try {
    const { name, email, phone, service } = req.body;
    const slot = await Slot.findById(req.params.id);

    // 1. Check if slot is valid
    if (!slot || slot.status !== "open") {
      return res.status(400).json({ message: "Slot unavailable" });
    }

    // 2. SAVE TO DATABASE (This works!)
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

    // 3. SEND SUCCESS RESPONSE IMMEDIATELY ⚡
    // We tell the app "Success" RIGHT NOW. We don't wait for email.
    // This stops the "Unable to book" error.
    res.json({ message: "Booked", slot });

    // 4. TRY SENDING EMAIL IN BACKGROUND (Fire & Forget)
    // If this fails, it will print to the console, but the User won't know.
    const sendBackgroundEmails = async () => {
      try {
        const patientMailOptions = {
          from: '"My Dental World" <krishnadpsranchi@gmail.com>',
          replyTo: 'kz8457@srmist.edu.in', 
          to: email,
          subject: `Appointment Confirmed: ${slot.date}`,
          text: `Hello ${name},\n\nConfirmed for ${slot.date} at ${slot.time} at ${branchInfo.name}.`,
        };

        const clinicMailOptions = {
          from: '"Dental System" <krishnadpsranchi@gmail.com>',
          to: "kz8457@srmist.edu.in",
          subject: `🔔 NEW BOOKING: ${name} (${branchInfo.name})`,
          text: `New Booking:\n${name}\n${phone}\n${branchInfo.name}\n${slot.date} @ ${slot.time}`,
        };

        // Attempt to send
        await Promise.all([
          transporter.sendMail(patientMailOptions),
          transporter.sendMail(clinicMailOptions)
        ]);
        console.log("✅ Emails sent successfully in background");
      } catch (emailErr) {
        // We catch the error here so it doesn't crash the server
        console.error("⚠️ Email failed (but booking is safe):", emailErr.message);
      }
    };

    // Trigger the email function (no await, just let it run)
    sendBackgroundEmails();

  } catch (err) {
    console.error("Database Error:", err);
    // Only send 500 if the DATABASE failed.
    if (!res.headersSent) res.status(500).json({ message: err.message });
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
// --- 🛠️ EMERGENCY RESET BUTTON (For Demo) ---
// Visit this link to fix "All Dates Booked" error:
// https://my-dental-api.onrender.com/api/reset-slots
router.get("/reset-slots", async (req, res) => {
  try {
    // 1. Reset ALL slots to 'open' status
    await Slot.updateMany(
      {}, // filter: match everything
      { 
        $set: { 
          status: "open", 
          patientName: null, 
          patientEmail: null, 
          patientPhone: null, 
          serviceType: null 
        } 
      }
    );

    // 2. Clear the Booking history log
    await Booking.deleteMany({});

    res.send(`
      <h1>✅ System Reset Successful</h1>
      <p>All slots have been forced to <strong>OPEN</strong>.</p>
      <p>All previous booking data has been cleared.</p>
      <p><strong>Action:</strong> Go back to your app and refresh the page.</p>
    `);
  } catch (err) {
    res.status(500).send("Reset Failed: " + err.message);
  }
});
module.exports = router;
