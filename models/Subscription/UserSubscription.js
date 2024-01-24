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
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema);
