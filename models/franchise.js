const mongoose = require("mongoose");

const FranchiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    products: {
      type: [String],
    },
    orders: {
      type: [mongoose.Schema.ObjectId],
      ref: "Order",
      default: null,
    },
    owner: {
      type: String,
      required: true,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", FranchiseSchema);
