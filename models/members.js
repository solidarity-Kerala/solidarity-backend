const mongoose = require("mongoose");

const membersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    areaOfInterest: {
      type: String,
      required: true,
    },
    birthulmal: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["Member"],
      required: true,
    },
    dob: {
      type: String,
    },
    memberStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MemberStatus",
      required: true,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", membersSchema);
