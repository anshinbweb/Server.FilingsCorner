const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createCategory,
  listCategory,
  listCategoryByParams,
  getCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/Products/Category");

const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Category");
  },

  filename: (req, file, cb) => {
    console.log("file name in route", file.fieldname);
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

if (!fs.existsSync("uploads/Category")) {
  fs.mkdirSync("uploads/Category");
}

router.post(
  "/auth/create-category",
  upload.single("CategoryImage"),
  catchAsync(createCategory)
);

router.get("/auth/list-category", catchAsync(listCategory));

router.post("/auth/list-category-by-params", catchAsync(listCategoryByParams));

router.get("/auth/get-category/:_id", catchAsync(getCategory));

router.put(
  "/auth/update-category/:_id",
  upload.single("CategoryImage"),
  catchAsync(updateCategory)
);

router.delete("/auth/remove-category/:_id", catchAsync(removeCategory));

module.exports = router;
