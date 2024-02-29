const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createSizeMaster,
  listSizeMaster,
  listSizeMasterByParams,
  getSizeMaster,
  updateSizeMaster,
  removeSizeMaster,
  listActiveSizeCategories,
} = require("../controllers/Category/SizeMaster");

router.post("/auth/create/size-category", catchAsync(createSizeMaster));

router.get("/auth/list/size-category", catchAsync(listSizeMaster));

router.get(
  "/auth/list-active/size-category",
  catchAsync(listActiveSizeCategories)
);

router.post(
  "/auth/list-by-params/size-category",
  catchAsync(listSizeMasterByParams)
);

router.get("/auth/get/size-category/:_id", catchAsync(getSizeMaster));

router.put("/auth/update/size-category/:_id", catchAsync(updateSizeMaster));

router.delete("/auth/remove/size-category/:_id", catchAsync(removeSizeMaster));

module.exports = router;
