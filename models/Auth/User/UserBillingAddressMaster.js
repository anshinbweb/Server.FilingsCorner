const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UserBillingAddressMasterSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    contactNo: {
      type: Number,
    },
    companyName: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    StateID: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    CountryID: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    address: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    isBillingSame: {
      type: Boolean,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UserBillingAddressMaster",
  UserBillingAddressMasterSchema
);
