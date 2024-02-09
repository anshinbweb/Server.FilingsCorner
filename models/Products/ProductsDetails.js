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
    category: {
      type: Schema.Types.ObjectId,
      ref: "CategoryMaster",
      required: true,
    },
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
    IsSubscriptionProduct: {
      type: Boolean,
      default: false,
    },
    IsGiftHamper: {
      type: Boolean,
      default: false,
    },

    isSize: {
      type: Boolean,
      default: false,
    },
    isDrink: {
      type: Boolean,
      default: false,
    },
    isMilk: {
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

module.exports = mongoose.model("ProductDetails", ProductDetailsSchema);
