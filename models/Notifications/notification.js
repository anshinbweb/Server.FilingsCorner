const mongoose = require("mongoose");

const UserNotificationSchema = mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    Type: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    URL: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    // IsRead: {
    //   type: Boolean,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userNotification", UserNotificationSchema);
