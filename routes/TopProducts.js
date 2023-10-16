const express = require("express");

const router = express.Router();

const {
  listTopProducts,
  createTopProducts,
  removeTopProducts,
  updateTopProducts,
  listTProducts,
  getTopProducts,
} = require("../controllers/TopProduct/TopProduct");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/top-products-create", catchAsync(createTopProducts));

router.get("/auth/list-top-products", catchAsync(listTopProducts));

router.post("/auth/topProducts-all", catchAsync(listTProducts));

router.get("/auth/top-products/:_id", catchAsync(getTopProducts));

router.put("/auth/top-products-update/:_id", catchAsync(updateTopProducts));

router.delete("/auth/top-products-delete/:_id", catchAsync(removeTopProducts));

module.exports = router;
