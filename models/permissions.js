const mongoose = require("mongoose");

const PermisssionsSchema = new mongoose.Schema(
    {
        isAndroidOnReview: {
            type: Boolean,
            default: null,
        },
        androidReviewVersionNumber: {
            type: String,
        },
        isIosOnReview: {
            type: Boolean,
            default: null,
        },
        iosReviewVersionNumber: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Permisssions", PermisssionsSchema);
