const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const GoldPriceSchema = new mongoose.Schema(
  {
    GoldPrice: {
      type: Number,
      required: true,
    },
    GoldCarat: {
      type: Schema.Types.ObjectId,
      ref: "goldkarats",
      required: true,
    },
    IsActive: {
      type: Boolean,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoldPrice", GoldPriceSchema);
