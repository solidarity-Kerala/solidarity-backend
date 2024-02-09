const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      enum: ["January", "February","March","April","May","June","July","August","September","October","November","December"],
    },
    Date:{
     type:Date
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
    },
    attendance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
