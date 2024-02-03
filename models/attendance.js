const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    // title:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Meeting",
    // },
    date: {
      type: Date,
    },
    place:{
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
    member: {
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
