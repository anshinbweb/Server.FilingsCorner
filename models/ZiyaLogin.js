const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ZiyaLoginSchema = new mongoose.Schema(
  {
    LoginEmail: {
      type: String,
    },
    Password: {
      type: String,
    },
    ContactName: {
      type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ZiyaLogin", ZiyaLoginSchema);
