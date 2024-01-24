

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const PromocodeMasterSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    save: {    //(percentage)
        type: Number
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromocodeMaster", PromocodeMasterSchema);