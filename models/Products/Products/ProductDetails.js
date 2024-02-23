//category
//product name
//image
//price
//description
//isSubs (true: put that product in subscription tab)
//isGifthamper
//productsubsmaster id (make dropdown from product subs)

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ProductDetailsSchema = new mongoose.Schema(
  {
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "CategoryMaster",
        required: true,
      },
    ],
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
    },
    basePrice: {
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
    productOptionId: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductOptions",
        required: true,
      },
    ],
    productVariantsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductVariants",
        required: true,
      },
    ],
    isOutOfStock: {
      // Need to change the API
      type: Boolean,
      default: false,
    },
    isSubscription: {
      // Need to change the API
      type: Boolean,
      default: false,
    },
    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductDetails", ProductDetailsSchema);
