const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createDrinkCategory,
  listDrinkCategory,
  listDrinkCategoryByParams,
  getDrinkCategory,
  updateDrinkCategory,
  removeDrinkCategory,
  listActiveDrinkCategories,
} = require("../controllers/Category/DrinkCategoryMaster");

router.post("/auth/create/drink-category", catchAsync(createDrinkCategory));

router.get("/auth/list/drink-category", catchAsync(listDrinkCategory));

router.get(
  "/auth/list-active/drink-category",
  catchAsync(listActiveDrinkCategories)
);

router.post(
  "/auth/list-by-params/drink-category",
  catchAsync(listDrinkCategoryByParams)
);

router.get("/auth/get/drink-category/:_id", catchAsync(getDrinkCategory));

router.put("/auth/update/drink-category/:_id", catchAsync(updateDrinkCategory));

router.delete(
  "/auth/remove/drink-category/:_id",
  catchAsync(removeDrinkCategory)
);

module.exports = router;
