const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
