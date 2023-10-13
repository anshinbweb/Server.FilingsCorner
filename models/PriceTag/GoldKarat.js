const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const GoldKaratSchema = new mongoose.Schema(
  {
    GoldKarat: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoldKarat", GoldKaratSchema);
