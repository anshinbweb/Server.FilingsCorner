const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
        },
        serviceDescription: {
            type: String,
            required: true,
        },
        requiredDocuments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "RequiredDocuments",
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

module.exports = mongoose.model("Services", ServicesSchema);
