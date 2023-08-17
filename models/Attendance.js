const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
    },
    month: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
