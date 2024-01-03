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
    IsTopProducts: {
      type: Boolean,
      default: false,
      // required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    IsPartner: {
      type: Boolean,
      default: false,
    },
    IsPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
