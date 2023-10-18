const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema(
  {
    StateName: {
      type: String,
      required: true,
      unique: true,
    },
    // StateCode: {
    //   type: Number,
    //   // required: true,
    //   unique: true,
    // },
    // CountryName: {
    //   type: String,
    //   required: true,
    // },
    CountryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    // LastUpdateBy: {
    //   //team id
    //   type: String,
    //   // default: "abcd1234",
    //   // required: true,
    // },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("State", StateSchema);
