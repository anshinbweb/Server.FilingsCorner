const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createDrinkCategoryMaster,
  listDrinkCategoryMaster,
  listDrinkCategoryMasterByParams,
  getDrinkCategoryMaster,
  updateDrinkCategoryMaster,
  removeDrinkCategoryMaster,
} = require("../controllers/Category/DrinkCategoryMaster");

router.post("/auth/create/drinkMaster", catchAsync(createDrinkCategoryMaster));

router.get("/auth/list/drinkMaster", catchAsync(listDrinkCategoryMaster));

router.post(
  "/auth/list-by-params/drinkMaster",
  catchAsync(listDrinkCategoryMasterByParams)
);

router.get("/auth/get/drinkMaster/:_id", catchAsync(getDrinkCategoryMaster));

router.put(
  "/auth/update/drinkMaster/:_id",
  catchAsync(updateDrinkCategoryMaster)
);

router.delete(
  "/auth/remove/drinkMaster/:_id",
  catchAsync(removeDrinkCategoryMaster)
);

module.exports = router;
