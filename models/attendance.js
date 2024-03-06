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
          default: "Absent",
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for status counts
attendanceSchema.virtual("statusCounts").get(function () {
  const statusCounts = { Present: 0, Absent: 0, Leave: 0 };
  this.members.forEach((member) => {
    if (statusCounts[member.status] !== undefined) {
      statusCounts[member.status]++;
    }
  });
  return statusCounts;
});

module.exports = mongoose.model("Attendance", attendanceSchema);
