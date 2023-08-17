const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    districtName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("District", districtSchema);
