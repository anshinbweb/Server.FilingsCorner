const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createProductOptions,
  listProductOptionsByParams,
  listProductOptions,
  updateProductOptions,
  removeProductOptions,
  getProductOptions,
  createProductOptionsForvariants,
  listProductOptionsByProductId,
  removeProductOptionsForvariants,
} = require("../controllers/Products/Products/ProductOptions");

router.post("/auth/create/productOptions", catchAsync(createProductOptions));

router.get("/auth/list/productOptions", catchAsync(listProductOptions));

router.post(
  "/auth/list-by-params/productOptions",
  catchAsync(listProductOptionsByParams)
);

router.get("/auth/get/productOptions/:_id", catchAsync(getProductOptions));

router.put(
  "/auth/update/productOptions/:_id",
  catchAsync(updateProductOptions)
);

router.delete(
  "/auth/remove/productOptions/:_id",
  catchAsync(removeProductOptions)
);

router.get("/auth/get/productOptionsByProductId/:_id", catchAsync(listProductOptionsByProductId));

router.post(
  "/auth/create/productOptionsForvariants",
  catchAsync(createProductOptionsForvariants)
);

router.post(
  "/auth/edit/removeproductOptionsForvariants",
  catchAsync(removeProductOptionsForvariants)
);

module.exports = router;
