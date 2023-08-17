const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema(
  {
    areaName: {
      type: String,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", areaSchema);
