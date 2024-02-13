const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createProductRatecard,
  listProductRatecard,
  listProductRatecardByParams,
  getProductRatecard,
  updateProductRatecard,
  removeProductRatecard,
} = require("../controllers/Products/ProductRatecard");

router.post("/auth/create/ProductRatecard", catchAsync(createProductRatecard));

router.get("/auth/list/ProductRatecard", catchAsync(listProductRatecard));

router.post(
  "/auth/list-by-params/ProductRatecard",
  catchAsync(listProductRatecardByParams)
);

router.get("/auth/get/ProductRatecard/:_id", catchAsync(getProductRatecard));

router.put(
  "/auth/update/ProductRatecard/:_id",
  catchAsync(updateProductRatecard)
);

router.delete(
  "/auth/remove/ProductRatecard/:_id",
  catchAsync(removeProductRatecard)
);

module.exports = router;
