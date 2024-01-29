const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    memberGroup:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membersgroup",
    },
    area:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Unit", UnitSchema);