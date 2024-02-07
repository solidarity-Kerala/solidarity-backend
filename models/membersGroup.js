const mongoose = require("mongoose");

const membersgroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    status: {
      type: Boolean,
      default: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membersgroup", membersgroupSchema);
