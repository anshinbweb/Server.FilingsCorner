const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createBlogs,
  listBlogs,
  listBlogsByParams,
  getBlogs,
  updateBlogs,
  removeBlogs,
} = require("../controllers/Blogs/Blogs");

router.post("/auth/create/blogs", catchAsync(createBlogs));

router.get("/auth/list/blogs", catchAsync(listBlogs));

router.post("/auth/list-by-params/blogs", catchAsync(listBlogsByParams));

router.get("/auth/get/blogs/:_id", catchAsync(getBlogs));

router.put("/auth/update/blogs/:_id", catchAsync(updateBlogs));

router.delete("/auth/remove/blogs/:_id", catchAsync(removeBlogs));

module.exports = router;
