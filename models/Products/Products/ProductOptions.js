const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ProductOptionsSchema = new mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetails",
      required: true,
    },
    parameterId: {
      type: Schema.Types.ObjectId,
      ref: "ParameterMaster",
      required: true,
    },
    parameterValueId: [
      {
        type: Schema.Types.ObjectId,
        ref: "ParameterValue",
        required: true,
      },
    ],
    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductOptions", ProductOptionsSchema);
