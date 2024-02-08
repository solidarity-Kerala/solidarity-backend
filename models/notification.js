const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        content: {
            type: String,
        },
        link: {
            type: String,
        },
        image: {
            type:String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
