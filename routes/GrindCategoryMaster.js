const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createGrindCategoryMaster,
  listGrindCategoryMaster,
  listGrindCategoryMasterByParams,
  getGrindCategoryMaster,
  updateGrindCategoryMaster,
  removeGrindCategoryMaster,
} = require("../controllers/Category/GrindCategoryMaster");

router.post("/auth/create/grindMaster", catchAsync(createGrindCategoryMaster));

router.get("/auth/list/grindMaster", catchAsync(listGrindCategoryMaster));

router.post(
  "/auth/list-by-params/grindMaster",
  catchAsync(listGrindCategoryMasterByParams)
);

router.get("/auth/get/grindMaster/:_id", catchAsync(getGrindCategoryMaster));

router.put(
  "/auth/update/grindMaster/:_id",
  catchAsync(updateGrindCategoryMaster)
);

router.delete(
  "/auth/remove/grindMaster/:_id",
  catchAsync(removeGrindCategoryMaster)
);

module.exports = router;
