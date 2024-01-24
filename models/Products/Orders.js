//userid
//productid
//quntity
//subsId
//total amount
//remark
//promocode
//address
//line 2
//name
//contactno
//country, state, city
//zip code

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const OrdersSchema = new mongoose.Schema(
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
    subsId: {     //need to look at it
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
    remark: {
      type: String,
    },
    promocode: {   //need to make promo master
      type: Schema.Types.ObjectId,
      ref: "PromocodeMaster"
    },
    name: {
      type: String,
    },
    contactNo: {
      type: Number,
    },
    address: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders",  OrdersSchema);
