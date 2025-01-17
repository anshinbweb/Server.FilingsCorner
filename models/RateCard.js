const mongoose = require("mongoose");

const RateCardSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Services",
            required: true,
        },
        frequencyTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FrequencyOption",
            required: true,
        },
        rate: {
            type: Number,
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

module.exports = mongoose.model("RateCard", RateCardSchema);
