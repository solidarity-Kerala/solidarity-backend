const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
    // place: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "District",
    // },
    place: {
      type: String,
    },
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
