const mongoose = require("mongoose");

const membersgroupSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membersgroup", membersgroupSchema);
