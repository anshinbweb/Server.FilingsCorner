const mongoose = require("mongoose");

const MediaPlayListSchema = new mongoose.Schema(
  {
    playListName: {
      type: String,
      required: true,
    },

    ad_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManageMedia",
        required: true,
      },
    ],
    IsActive: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaPlayList", MediaPlayListSchema);
