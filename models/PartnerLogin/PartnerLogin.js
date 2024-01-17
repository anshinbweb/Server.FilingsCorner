const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const PartnerLoginSchema = new mongoose.Schema(
  {
    ContactName: {
      type: String,
      required: true,
    },

    UserName: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },

    IsActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerLogin", PartnerLoginSchema);
