const mongoose = require("mongoose");

const membersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    unit:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    address: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    profession: {
      type: String,
    },
    qualification: {
      type: String,
    },
    areaOfInterest: {
      type: String,
    },
    bithulmal: {
      type: Number,
     
    },
    userType: {
      type: String,
      enum: ["Member"],
    },
    dob: {
      type: String,
    },
    memberStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MemberStatus",
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", membersSchema);
