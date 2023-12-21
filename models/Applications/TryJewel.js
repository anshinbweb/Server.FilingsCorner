const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const TryJewelSchema = new mongoose.Schema(
  {
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "CategoryProducts",
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    scaleFactor: {
      type: Number,
      required: true,
    },
    x: Number,
    y: Number,
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TryJewel", TryJewelSchema);
