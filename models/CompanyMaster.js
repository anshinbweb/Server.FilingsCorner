const mongoose = require("mongoose");

const CompanyMasterSchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
      required: true,
    },
    ContactPersonName: {
      type: String,
      required: true,
    },
    EmailID_Company: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    CountryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    StateID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    City: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Pincode: {
      type: Number,
      required: true,
    },
    ContactNo_Sales: {
      type: Number,
      // required: true,
    },
    ContactNo_Support: {
      type: Number,
      // required: true,
    },
    ContactNo_Office: {
      type: Number,
      required: true,
    },
    EmailID_Office: {
      type: String,
      required: true,
    },
    EmailID_Support: {
      type: String,
      // required: true,
    },
    EmailID_Sales: {
      type: String,
      // required: true,
    },
    Website1: {
      type: String,
      required: true,
    },
    Website2: {
      type: String,
    },
    Favicon: {
      type: String,
    },
    Icon: {
      type: String,
    },
    Logo: {
      type: String,
    },
    DigitalSignature: {
      type: String,
    },
    GSTNo: {
      type: String,
      // required: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
      // required: true,
    },
    CompanyDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetails",
      required:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyMaster", CompanyMasterSchema);
