const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
