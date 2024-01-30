const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createInquiry, listInquiry, listInquiryByParams, getInquiry, updateInquiry, removeInquiry } = require("../controllers/PolicyAndInquiry/Inquiry");


router.post("/auth/create/Inquiry", catchAsync(createInquiry));

router.get("/auth/list/Inquiry", catchAsync(listInquiry));

router.post("/auth/list-by-params/Inquiry", catchAsync(listInquiryByParams));

router.get("/auth/get/Inquiry/:_id", catchAsync(getInquiry));

router.put("/auth/update/Inquiry/:_id", catchAsync(updateInquiry));

router.delete("/auth/remove/Inquiry/:_id", catchAsync(removeInquiry));

module.exports = router;
