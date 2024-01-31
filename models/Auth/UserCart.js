const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UserCartSchema = new mongoose.Schema(
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
      required: true,
    },
    quntity: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserCart", UserCartSchema);
