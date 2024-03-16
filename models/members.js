const mongoose = require("mongoose");

const membersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    unit:{
      type: String,
    },
    address: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    bloodGroup: {
      type: String,
      enum: ["A+ve","A-ve","B+ve","B-ve","AB+ve","AB-ve","O+ve","O-ve"],
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
    email: {
      type: String,
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
