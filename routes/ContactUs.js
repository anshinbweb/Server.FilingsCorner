const express = require("express");

const router = express.Router();

const {
  listContactUs,
  createContactUs,
  removeInquiry,
  listCUs,
  getContactUs,
} = require("../controllers/ContactUs/ContactUs");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/contact-create", catchAsync(createContactUs));

router.get("/auth/list-contact", catchAsync(listContactUs));

router.post("/auth/contact-all", catchAsync(listCUs));

router.get("/auth/get-contact/:_id", catchAsync(getContactUs));

router.delete("/auth/delete-inquiry/:_id", catchAsync(removeInquiry));

module.exports = router;
