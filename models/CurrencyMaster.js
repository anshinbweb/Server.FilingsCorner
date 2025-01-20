const mongoose = require("mongoose");

const CurrencyMasterSchema = new mongoose.Schema(
    {
        currencyName: {
            type: String,
            required: true,
        },
        currencyCode: {
            type: String,
            required: true,
        },
        currencySymbol: {
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

module.exports = mongoose.model("CurrencyMaster", CurrencyMasterSchema);
