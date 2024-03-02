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
  listProductVariantsByProductId,
  updateProductVariantSubs,
  updateProductVariantStock,
  updateProductVariantActive,
  updateProductVariantPrice,
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

router.post(
  "/auth/get/productVariantsInfo",
  catchAsync(getProductVariantsInfo)
);

router.get(
  "/auth/get/productVariantsByProductId/:_id",
  catchAsync(listProductVariantsByProductId)
);

router.put(
  "/auth/update/productVariantPrice/:_id",
  catchAsync(updateProductVariantPrice)
);

router.put(
  "/auth/update/productVariantSubs/:_id",
  catchAsync(updateProductVariantSubs)
);

router.put(
  "/auth/update/productVariantStock/:_id",
  catchAsync(updateProductVariantStock)
);

router.put(
  "/auth/update/productVariantActive/:_id",
  catchAsync(updateProductVariantActive)
);

module.exports = router;
