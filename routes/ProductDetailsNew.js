const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  getProductsDetails,
  createProductsDetails,
  listProductsDetails,
  listProductByCategory,
  getProductByID,
  listProductsDetailsByParams,
  updateProductsDetails,
  removeProductsDetails,
  CategoryProductListData,
  getProductsOptions,
  getProductsOptionsParameters,
} = require("../controllers/Products/Products/ProductDetails");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/Products");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/product/product-details",
  upload.single("myFile"),
  catchAsync(createProductsDetails)
);

router.get(
  "/auth/list/product/product-details",
  catchAsync(listProductsDetails)
);

router.post(
  "/auth/list-by-params/product/product-details",
  catchAsync(listProductsDetailsByParams)
);

router.get(
  "/auth/get/product/product-details/:_id",
  catchAsync(getProductsDetails)
);

router.put(
  "/auth/update/product/product-details/:_id",
  upload.single("myFile"),
  catchAsync(updateProductsDetails)
);

router.delete(
  "/auth/remove/product/product-details/:_id",
  catchAsync(removeProductsDetails)
);

// NEWWWW
router.post(
  "/auth/get/product/category-product-list",
  catchAsync(CategoryProductListData)
);

// APPLICATION
router.get(
  "/auth/list/product/product-by-category/:categoryId",
  catchAsync(listProductByCategory)
);

router.post(
  "/auth/list/product/product-by-id/:productId",
  catchAsync(getProductByID)
);

router.get(
  "/auth/get/product/product-options/:productId",
  catchAsync(getProductsOptions)
);

router.get(
  "/auth/get/product/product-options-parameters/:productId/:optionId",
  catchAsync(getProductsOptionsParameters)
);

module.exports = router;
