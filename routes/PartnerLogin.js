const express = require("express");
const {
  createPartner,
  listPartner,
  listPartnerByParams,
  removePartner,
  getPartner,
  updatePartner,
  getPartnerLoginDetails,
} = require("../controllers/PartnerLogin/PartnerLogin");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/auth/partners/ziya", catchAsync(listPartner));
router.post("/auth/partners/ziya-by-params", catchAsync(listPartnerByParams));
router.delete("/auth/partners/remove-ziya/:_id", catchAsync(removePartner));
router.get("/auth/get-partner/:_id", catchAsync(getPartner));

router.get(
  "/auth/find-partner-details/:username/:password",
  catchAsync(getPartnerLoginDetails)
);

router.post("/auth/create-partner/ziya", catchAsync(createPartner));
router.put("/auth/partner/update-ziya/:_id", catchAsync(updatePartner));

module.exports = router;
