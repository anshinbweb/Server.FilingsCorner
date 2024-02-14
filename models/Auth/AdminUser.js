const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const AdminUsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    Email: {
      type: String,
    },
    Password: {
      type: String,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUser", AdminUsersSchema);
