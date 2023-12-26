const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createCategoryProducts,
  listCategoryProducts,
  listCategoryProductsByParams,
  getCategoryProducts,
  updateCategoryProducts,
  removeCategoryProducts,
  FilterProductByWeight,
  listAllTrendingProducts,
} = require("../controllers/Products/CategoryProduct");

const multer = require("multer");
const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "uploads/CategoryProducts");
  // },
  destination: function (req, file, cb) {
    if (file.fieldname === "ProductImage") {
      cb(null, "uploads/CategoryProducts");
    } else if (file.fieldname === "ProductHoverImage") {
      cb(null, "uploads/CategoryProducts");
    }
  },
  // filename: function (req, file, cb) {
  //   cb(null, Date.now() + "_" + file.originalname);
  // },
  filename: (req, file, cb) => {
    console.log("file name in route", file.fieldname);
    if (file.fieldname === "ProductImage") {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    } else if (file.fieldname === "ProductHoverImage") {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
  },
});

const upload = multer({ storage: storage });

router.post(
  "/auth/create-category-products",
  // upload.single("myFile"),
  upload.fields([
    {
      name: "ProductImage",
      maxCount: 1,
    },
    {
      name: "ProductHoverImage",
      maxCount: 1,
    },
  ]),

  catchAsync(createCategoryProducts)
);

router.get("/auth/list-category-products", catchAsync(listCategoryProducts));

router.post(
  "/auth/list-cproducts-by-params",
  catchAsync(listCategoryProductsByParams)
);

router.post(
  "/auth/list-all-trending-products",
  catchAsync(listAllTrendingProducts)
);

router.get("/auth/get-category-products/:_id", catchAsync(getCategoryProducts));

router.get(
  "/auth/filter-products-weight/:minWeight/:maxWeight",
  catchAsync(FilterProductByWeight)
);

router.put(
  "/auth/update-category-products/:_id",
  // upload.single("myFile"),
  upload.fields([
    {
      name: "ProductImage",
      maxCount: 1,
    },
    {
      name: "ProductHoverImage",
      maxCount: 1,
    },
  ]),

  catchAsync(updateCategoryProducts)
);

router.delete(
  "/auth/remove-category-products/:_id",
  catchAsync(removeCategoryProducts)
);

module.exports = router;
