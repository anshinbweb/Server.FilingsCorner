const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createFAQ,
  listFAQ,
  listFAQByParams,
  getFAQ,
  updateFAQ,
  removeFAQ,
} = require("../controllers/PolicyAndInquiry/FAQ");

router.post("/auth/create/blogs", catchAsync(createFAQ));

router.get("/auth/list/blogs", catchAsync(listFAQ));

router.post("/auth/list-by-params/blogs", catchAsync(listFAQByParams));

router.get("/auth/get/blogs/:_id", catchAsync(getFAQ));

router.put("/auth/update/blogs/:_id", catchAsync(updateFAQ));

router.delete("/auth/remove/blogs/:_id", catchAsync(removeFAQ));

module.exports = router;
