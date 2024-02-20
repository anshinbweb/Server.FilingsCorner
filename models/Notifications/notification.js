const mongoose = require("mongoose");

const UserNotificationSchema = mongoose.Schema(
  {
    UserId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
    Type: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    // URL: {
    //   type: String,
    //   required: true,
    // },
    isActive: {
      type: Boolean,
      default: false,
      // required: true,
    },
    // IsRead: {
    //   type: Boolean,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userNotification", UserNotificationSchema);
