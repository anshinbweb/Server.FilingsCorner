//fn , ln
//private/public
// email
//password
//followers && following if public (if user is public then sow this user in members)
//type: admin or customer

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    IsPublic: {
      type: Boolean,
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
    UserType: {
      type: String, //admin, user
      default: "user"
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCart",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UsersSchema);
