const mongoose = require("mongoose");

const SuperAdminMasterSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required:true
        },
        password: {
            type: String,
            required:true
        },
        IsActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SuperAdminMaster", SuperAdminMasterSchema);