const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const CitySchema = new mongoose.Schema(
  {
    CityName: {
      type: String,
      required: true,
    },
    StateID: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    // StateName: {
    //   type: String,
    //   required: true,
    // },
    CountryID: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    // CityCode: {
    //   type: Number,
    //   required: true,
    // },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", CitySchema);