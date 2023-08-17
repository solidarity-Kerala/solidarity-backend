const mongoose = require("mongoose");

const UserTypeSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      unique: true,
      // enum: ["customer", "vendor", "admin"],
    },
    roleDisplayName: {
      type: String,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("UserType", UserTypeSchema);
