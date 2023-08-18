const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    link: {
      type: String,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "franchise"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("faq", FaqSchema);
