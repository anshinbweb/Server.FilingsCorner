// const express = require("express");

// const router = express.Router();

// const catchAsync = require("../utils/catchAsync");
// const {
//   createCategory,
//   listCategory,
//   listCategoryByParams,
//   getCategory,
//   updateCategory,
//   removeCategory,
// } = require("../controllers/Products/CategoryProduct");

// router.post("/auth/create-category", catchAsync(createCategory));

// router.get("/auth/list-category", catchAsync(listCategory));

// router.post("/auth/list-category-by-params", catchAsync(listCategoryByParams));

// router.get("/auth/get-category/:_id", catchAsync(getCategory));

// router.put("/auth/uppdate-category/:_id", catchAsync(updateCategory));

// router.delete("/auth/remove-category/:_id", catchAsync(removeCategory));

// module.exports = router;

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
} = require("../controllers/Products/CategoryProduct");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/CategoryProducts");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/auth/create-category-products",
  upload.single("myFile"),

  catchAsync(createCategoryProducts)
);

router.get("/auth/list-category-products", catchAsync(listCategoryProducts));

router.post(
  "/auth/list-cproducts-by-params",
  catchAsync(listCategoryProductsByParams)
);

router.get("/auth/get-category-products/:_id", catchAsync(getCategoryProducts));

router.put(
  "/auth/update-category-products/:_id",
  upload.single("myFile"),

  catchAsync(updateCategoryProducts)
);

router.delete(
  "/auth/remove-category-products/:_id",
  catchAsync(removeCategoryProducts)
);

module.exports = router;
