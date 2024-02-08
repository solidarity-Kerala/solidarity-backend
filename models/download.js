const mongoose = require("mongoose");

const DownloadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    date: {
      type: Date,
    },
    document: {
      type: String,
    },
 },
  { timestamps: true }
);

module.exports = mongoose.model("Download", DownloadSchema);
