const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const ProspectSchema = new mongoose.Schema(
  {
    // InqId: {
    //   type: Number,
    //   required: true,
    // },
    ContactPersonName: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    EmailID: {
      type: String,
      required: true,
    },

    ContactNo: {
      type: Number,
      required: true,
    },
    DateOfBirth: {
      type: Date,
      default: null,
    },
    AnniversaryDate: {
      type: Date,
      default: null,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categoryproducts",
      },
    ],

    IsActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

// ProspectSchema.plugin(autoIncrement.plugin, {
//   model: "Prospect",
//   field: "InqId",
//   startAt: 1,
//   incrementBy: 1,
// });

module.exports = mongoose.model("Prospect", ProspectSchema);
