const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const EnergyCategoryMasterSchema = new mongoose.Schema(
  {
    energyType: {
      type: String,
      required: true,
    },
    Category: {
      type: Schema.Types.ObjectId,
      ref: "CategoryMaster",
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EnergyCategoryMaster",
  EnergyCategoryMasterSchema
);
