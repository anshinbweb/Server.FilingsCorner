//title
//desc
//likes: type array of userId
//comments: type of array userId and comment
//userId   (created blog by which user)
//created at

const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const BlogsSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },
    blogDesc: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogComment",
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    IsActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", BlogsSchema);
