const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    place: {
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
    members: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave"],
        },
      },
    ],
    month: {
      type: String,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
