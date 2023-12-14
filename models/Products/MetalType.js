const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const MetalTypeMasterSchema = new mongoose.Schema(
  {
    MetalType: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MetalTypeMaster", MetalTypeMasterSchema);
