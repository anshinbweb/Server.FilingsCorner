const express = require("express");
const path = require("path");

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

const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/TopProducts");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "ProductImage") {
      cb(null, "uploads/TopProducts");
    } else if (file.fieldname === "ProductHoverImage") {
      cb(null, "uploads/TopProducts");
    }
  },

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
  "/auth/top-products-create",
  //   upload.single("myFile"),
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
  catchAsync(createTopProducts)
);

router.get("/auth/list-top-products", catchAsync(listTopProducts));

router.post("/auth/topProducts-all", catchAsync(listTProducts));  //by params

router.get("/auth/top-products/:_id", catchAsync(getTopProducts));

router.put(
  "/auth/top-products-update/:_id",
  //   upload.single("myFile"),
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
  catchAsync(updateTopProducts)
);

router.delete("/auth/top-products-delete/:_id", catchAsync(removeTopProducts));

module.exports = router;
