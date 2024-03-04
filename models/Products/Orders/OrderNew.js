const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    orderId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrdersDetils",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
      required: false,
    },
    promocode: {
      type: Schema.Types.ObjectId,
      ref: "PromocodeMaster",
      required: false,
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "usershippingaddressmasters",
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "userbillingaddressmasters",
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    OrderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderNew", OrdersSchema);
