const mongoose = require("mongoose");

const ServiceGroupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        services: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Services",
            required: true,
        },
        companyDetailsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyDetails",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ServiceGroup", ServiceGroupSchema);
