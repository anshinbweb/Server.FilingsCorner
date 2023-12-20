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
    ProductWeight: {
      type: Number,
      // required: true,
    },
    ProductName: {
      type: String,
    },
    ProductDescription: {
      type: String,
    },
    MetalDetails: [
      {
        MetalName: {
          type: String,
        },
        MetalDescription: {
          type: String,
        },
        MetalWeight: {
          type: Number,
        },
      },
    ],
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryProducts", CategoryProductsSchema);
