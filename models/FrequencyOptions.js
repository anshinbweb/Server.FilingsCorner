const mongoose = require("mongoose");

const FrequencyOptionSchema = new mongoose.Schema(
    {
        frequencyType: {
            type: String,
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

module.exports = mongoose.model("FrequencyOption", FrequencyOptionSchema);
