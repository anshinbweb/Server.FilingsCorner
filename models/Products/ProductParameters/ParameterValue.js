const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ParameterValueSchema = new mongoose.Schema(
  {
    parameterId: {
      type: Schema.Types.ObjectId,
      ref: "ParameterMaster", //milk
      required: true,
    },
    parameterValue: {
      type: String, //oat milk
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParameterValue", ParameterValueSchema);
