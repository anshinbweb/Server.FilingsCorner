const mongoose = require("mongoose");

const RequiredDocumentsSchema = new mongoose.Schema(
    {
        documentName: {
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

module.exports = mongoose.model("RequiredDocuments", RequiredDocumentsSchema);
