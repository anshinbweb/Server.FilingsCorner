const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createCategory,
  listCategory,
  listCategoryByParams,
  getCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/Products/Category");

router.post("/auth/create-category", catchAsync(createCategory));

router.get("/auth/list-category", catchAsync(listCategory));

router.post("/auth/list-category-by-params", catchAsync(listCategoryByParams));

router.get("/auth/get-category/:_id", catchAsync(getCategory));

router.put("/auth/uppdate-category/:_id", catchAsync(updateCategory));

router.delete("/auth/remove-category/:_id", catchAsync(removeCategory));

module.exports = router;
