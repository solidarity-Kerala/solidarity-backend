const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
        },
        description: {
            type: String,
        },
        eligibility: {
            type: String,
        },
        duration: {
            type: String,
        },
        image: {
            type: String,
        },
        category: {
            type: String,
            // enum : UG, PG, Certificate
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
