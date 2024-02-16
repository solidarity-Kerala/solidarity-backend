const mongoose = require("mongoose");

const bithulmalSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    paymentDate: {
      type: Date,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
    amountPaid: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Bithulmal", bithulmalSchema);
