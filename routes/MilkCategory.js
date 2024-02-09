const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createMilkCategory,
  listMilkCategory,
  listMilkCategoryByParams,
  getMilkCategory,
  updateMilkCategory,
  removeMilkCategory,
  listActiveMilkCategories,
} = require("../controllers/Category/MilkCategory");

router.post("/auth/create/milk-category", catchAsync(createMilkCategory));

router.get("/auth/list/milk-category", catchAsync(listMilkCategory));

router.get(
  "/auth/list-active/milk-category",
  catchAsync(listActiveMilkCategories)
);

router.post(
  "/auth/list-by-params/milk-category",
  catchAsync(listMilkCategoryByParams)
);

router.get("/auth/get/milk-category/:_id", catchAsync(getMilkCategory));

router.put("/auth/update/milk-category/:_id", catchAsync(updateMilkCategory));

router.delete(
  "/auth/remove/milk-category/:_id",
  catchAsync(removeMilkCategory)
);

module.exports = router;
