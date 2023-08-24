const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookingId: {
      type: String,
    },
    bookingDate: {
      type: Date,
    },
    bookingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingSlot",
    },
    dietician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dischargeDate: {
      type: Date,
      default: null,
    },
    admissionDate: {
      type: Date,
      default: null,
    },
    admissionType: {
      type: String,
      default: "IN",
    },
    roomNumber: {
      type: String,
    },
    appointmentStatus: {
      type: String,
      enum: ["Scheduled", "In Progress", "Closed"],
      default: "Scheduled",
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
