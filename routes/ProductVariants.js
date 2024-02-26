const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createProductVariants,
  getProductVariants,
  removeProductVariants,
  updateProductVariants,
  listProductVariants,
  listProductVariantsByParams,
  getProductVariantsInfo,
} = require("../controllers/Products/Products/ProductVariants");

router.post("/auth/create/productVariants", catchAsync(createProductVariants));

router.get("/auth/list/productVariants", catchAsync(listProductVariants));

router.post(
  "/auth/list-by-params/productVariants",
  catchAsync(listProductVariantsByParams)
);

router.get("/auth/get/productVariants/:_id", catchAsync(getProductVariants));

router.put(
  "/auth/update/productVariants/:_id",
  catchAsync(updateProductVariants)
);

router.delete(
  "/auth/remove/productVariants/:_id",
  catchAsync(removeProductVariants)
);

router.get("/auth/get/productVariantsInfo", catchAsync(getProductVariantsInfo));

module.exports = router;
