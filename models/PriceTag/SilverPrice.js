const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const SilverPriceSchema = new mongoose.Schema(
  {
    SilverPrice: {
      type: Number,
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SilverPrice", SilverPriceSchema);
