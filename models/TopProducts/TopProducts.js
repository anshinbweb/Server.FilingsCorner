const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const TopProductsSchema = new mongoose.Schema(
  {
    NameOfProduct: {
      type: String,
      required: true,
    },
    ProductImage: {
      type: String,
      required: true,
    },
    ProductHoverImage: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopProducts", TopProductsSchema);
