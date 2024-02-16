const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ProductOptionsSchema = new mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetails",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "CategoryMaster",
      required: true,
    },
    subCategoryId: [
      {
        type: Schema.Types.ObjectId,
        ref: "CategoryMaster",
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
