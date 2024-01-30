
//fn, ln, email, msg
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const InquirySchema = new mongoose.Schema(
  {
    ContactName: {
      type: String,
      required: true,
    },
    ContactEmail: {
      type: String,
      required: true,
    },
    ContactNumber: {
      type: Number,
      required: true,
    },
    Message: {
      type: String,
      required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
