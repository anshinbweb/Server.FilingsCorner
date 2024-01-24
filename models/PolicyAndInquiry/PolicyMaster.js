//policy master
//desc
//is active


const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const PolicyMasterSchema = new mongoose.Schema(
  {
    policyName: {
        type: String,
    },
    policyDesc: {
        type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PolicyMaster", PolicyMasterSchema);
