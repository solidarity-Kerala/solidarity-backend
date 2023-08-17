const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
