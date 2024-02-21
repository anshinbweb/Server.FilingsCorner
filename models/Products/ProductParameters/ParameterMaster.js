
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ParameterMasterSchema = new mongoose.Schema(
  {
    parameterName: {
        type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParameterMaster", ParameterMasterSchema);