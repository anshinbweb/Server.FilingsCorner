//title
//save

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const SubscriptionMasterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    savePercentage: {
      type: Number,
    },
    days: {
      // Need to change the API
      type: Number,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionMaster", SubscriptionMasterSchema);
