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
      ref: "DrinkCategoryMaster",
      required: true,
    },
    productName: {
      type: String,
    },
    productImage: {
      type: String,
    },
    productDescription: {
      type: String,
    },
    price: {
      type: Number,
    },
    IsActive: {
      type: Boolean,
    },
    IsSubscriptionProduct: {
      type: Boolean,
    },
    IsGiftHamper: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductDetails", ProductDetailsSchema);
