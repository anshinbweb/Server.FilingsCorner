//size
//category
//is active

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const SizeMasterSchema = new mongoose.Schema(
  {
    size: {
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
  "SizeMaster",
  SizeMasterSchema
);
