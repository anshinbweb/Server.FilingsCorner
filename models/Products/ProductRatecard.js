
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ProductRatecardSchema = new mongoose.Schema(
  {
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "CategoryMaster",
        required: true,
      },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetails",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: false,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductRatecard", ProductRatecardSchema);
