const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const OrdersDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "OrderNew",
      required: false,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetails",
      required: true,
    },
    productVariantsId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariants",
      required: false,
    },
    subsId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionMaster",
      required: false,
    },
    isSubs: {
      // to check if product is ordered automatically as subscription
      type: Boolean, // false for first time order
      default: false,
      required: true,
    },
    isLatestOrder: {
      type: Boolean, 
      default: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrdersDetilsNew", OrdersDetailsSchema);
