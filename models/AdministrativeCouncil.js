const mongoose = require("mongoose");

const AdministrativeCouncilSchema = new mongoose.Schema(
    {
        enName: {
            type: String,
        },
        enDesignation: {
            type: String,
        },
        enDescription: {
            type: String,
        },
        image: {
            type: String,
        },
        active: {
            type: Boolean,
            default: null,
        },
        arName: {
            type: String,
        },
        arDesignation: {
            type: String,
        },
        arDescription: {
            type: String,
        },
        urName: {
            type: String,
        },
        urDesignation: {
            type: String,
        },
        urDescription: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdministrativeCouncil", AdministrativeCouncilSchema);
