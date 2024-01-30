const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createProductsDetails,
  listProductsDetails,
  listProductsDetailsByParams,
  getProductsDetails,
  updateProductsDetails,
  removeProductsDetails,
} = require("../controllers/Products/ProductsDetails");

router.post("/auth/create/product-details", catchAsync(createProductsDetails));

router.get("/auth/list/product-details", catchAsync(listProductsDetails));

router.post(
  "/auth/list-by-params/product-details",
  catchAsync(listProductsDetailsByParams)
);

router.get("/auth/get/product-details/:_id", catchAsync(getProductsDetails));

router.put("/auth/update/product-details/:_id", catchAsync(updateProductsDetails));

router.delete("/auth/remove/product-details/:_id", catchAsync(removeProductsDetails));

module.exports = router;
