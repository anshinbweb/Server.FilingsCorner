//grind type
//is active
//drinkk category master id

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const GrindCategoryMasterSchema = new mongoose.Schema(
  {
    grindType: {
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
  "GrindCategoryMaster",
  GrindCategoryMasterSchema
);
