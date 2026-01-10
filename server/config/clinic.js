// server/config/clinic.js
module.exports = {
  openingTime: "10:00", // Clinic opens
  closingTime: "19:00", // Clinic closes
  slotDuration: 30, // Minutes per patient
  breakTimeStart: "13:00", // Lunch start
  breakTimeEnd: "16:30", // Lunch end
  closedDays: [0], // 0 = Sunday (Closed)
  bookingWindowDays: 7, // Generate slots for next 7 days
};
