const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
