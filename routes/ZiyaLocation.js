const express = require("express");
const {
  createZiyaLocation,
  listZiyaLocation,
  listZiyaLocationByParams,
  removeZiyaLocation,
  getZiyaLocation,
  updateZiyaLocation,
} = require("../controllers/ZiyaLocation");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/auth/locations/ziya", catchAsync(listZiyaLocation));
router.post("/auth/location/ziya-by-params", catchAsync(listZiyaLocationByParams));
router.delete("/auth/location/remove-ziya/:_id", catchAsync(removeZiyaLocation));
router.get("/auth/location/get-ziya/:_id", catchAsync(getZiyaLocation));

router.post("/auth/location/ziya", catchAsync(createZiyaLocation));
router.put("/auth/location/update-ziya/:_id", catchAsync(updateZiyaLocation));

module.exports = router;
