const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const OrdersDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetails",
      required: true,
    },
    subsId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionMaster",
      // required: true,
    },
    quantity: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    sizeId: {
      // if product is drink: small, medium, large
      type: Schema.Types.ObjectId,
      ref: "SizeMaster",
      // required: true,
    },
    drinkId: {
      // if product is drink: hot, iced, blend
      type: Schema.Types.ObjectId,
      ref: "DrinkCategoryMaster",
      // required: true,
    },
    milkCategory: {
      // if product is drink: whole milk, oat, soya...
      type: Schema.Types.ObjectId,
      ref: "MilkCategoryMaster",
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrdersDetils", OrdersDetailsSchema);
