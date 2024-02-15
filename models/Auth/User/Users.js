//fn , ln
//private/public
// email
//password
//followers && following if public (if user is public then sow this user in members)
//type: admin or customer

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    contactNo: {
      type: Number,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    IsActive: {
      type: Boolean,
    },
    IsPublic: {
      type: Boolean,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCart",
      },
    ],
    defaultShippingAddress: {
      type: Number,
    },
    defaultBillingAddress: {
      type: Number,
    },
    shippingAddress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserShippingAddressMaster",
      },
    ],
    billingAddress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserShippingAddressMaster",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UsersSchema);
