//que
//ans
//userid

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const FAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
        type: String,
      },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", FAQSchema);
