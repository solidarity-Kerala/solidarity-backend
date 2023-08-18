const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
    },
    availableIn: {
      type: String,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
    },
    image3: {
      type: String,
    },
    barSizeInfo: {
      type: String,
    },
    specifications: {
      type: String,
    },
    packaging: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductDetails", ProductDetailsSchema);
