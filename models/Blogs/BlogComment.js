const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const BlogCommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users", // Reference to the User model
    required: true,
  },
});

module.exports = mongoose.model("BlogComment", BlogCommentSchema);

