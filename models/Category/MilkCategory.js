//milk type
//category
//is active

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const MilkCategoryMasterSchema = new mongoose.Schema(
  {
    milkType: {
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
  "MilkCategoryMaster",
  MilkCategoryMasterSchema
);
