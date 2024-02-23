//userid
//subsid from productsubsmaster
//productid from productdetails
//(make entry when user buy sumething and select subscription)

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UserSubscriptionSchema = new mongoose.Schema(
  {
    remark: {
      type: String,
    },
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
    productVariantsId: {
      // Need to change the API
      type: Schema.Types.ObjectId,
      ref: "ProductVariants",
      // required: true,
    },
    quantity: {
      // Need to change the API
      type: Number,
    },
    nextOrderDate: {
      // Need to change the API
      type: Date,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema);
