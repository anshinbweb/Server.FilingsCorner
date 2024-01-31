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

router.post("/auth/create/product-details",upload.single("myFile"), catchAsync(createProductsDetails));

router.get("/auth/list/product-details", catchAsync(listProductsDetails));

router.post(
  "/auth/list-by-params/product-details",
  catchAsync(listProductsDetailsByParams)
);

router.get("/auth/get/product-details/:_id", catchAsync(getProductsDetails));

router.put("/auth/update/product-details/:_id",upload.single("myFile"), catchAsync(updateProductsDetails));

router.delete("/auth/remove/product-details/:_id", catchAsync(removeProductsDetails));

module.exports = router;
