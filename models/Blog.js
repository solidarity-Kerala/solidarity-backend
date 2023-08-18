const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        author: {
            type: String,
        },
        content: {
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

module.exports = mongoose.model("Blog", BlogSchema);
