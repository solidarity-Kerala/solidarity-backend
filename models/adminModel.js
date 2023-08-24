const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    membersGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "Membersgroup",
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
