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

router.post("/auth/create/faq", catchAsync(createFAQ));

router.get("/auth/list/faq", catchAsync(listFAQ));

router.post("/auth/list-by-params/faq", catchAsync(listFAQByParams));

router.get("/auth/get/faq/:_id", catchAsync(getFAQ));

router.put("/auth/update/faq/:_id", catchAsync(updateFAQ));

router.delete("/auth/remove/faq/:_id", catchAsync(removeFAQ));

module.exports = router;
