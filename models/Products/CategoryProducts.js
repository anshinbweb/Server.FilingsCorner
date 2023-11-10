const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CategoryProductsSchema = new mongoose.Schema(
  {
    Category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    ProductImage: {
      type: String,
    },
    ProductName: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryProducts", CategoryProductsSchema);
