const e = require("express");
const mongoose = require("mongoose");

const MemberStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Active", "Inactive", "Abroad"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MemberStatus", MemberStatusSchema);
