const mongoose = require("mongoose");

const associatesSchema = new mongoose.Schema(
  {
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
    type: {
      type: String,
      enum: ["Associates"],
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
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Associate", associatesSchema);
