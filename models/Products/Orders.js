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
    orderId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrdersDetils",
        required: true,
      },
    ],
    remark: {
      type: String,
    },
    promocode: {
      type: Schema.Types.ObjectId,
      ref: "PromocodeMaster",
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

module.exports = mongoose.model("Orders", OrdersSchema);
