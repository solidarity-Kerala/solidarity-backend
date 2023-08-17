const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Designation", DesignationSchema);
