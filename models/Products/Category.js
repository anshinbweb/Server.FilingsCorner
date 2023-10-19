const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    Category: {
      type: String,
      required: true,
    },
    CategoryImage: {
      type: String,
    },
    Description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
