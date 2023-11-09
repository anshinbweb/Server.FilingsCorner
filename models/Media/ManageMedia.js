const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ManageMediaSchema = new mongoose.Schema(
  {
    MediaName: {
      type: String,
      required: true,
    },
    Media: {
      type: String,
    },
    Description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManageMedia", ManageMediaSchema);
