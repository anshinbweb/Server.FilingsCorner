const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createTryJewel,
  listTryJewel,
  listTryJewelByParams,
  getTryJewel,
  updateTryJewel,
  removeTryJewel,
  getTryJewelByProduct,
} = require("../controllers/Applications/TryJewel");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/TryOnProducts");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post("/auth/create-try-jewel", upload.single("myFile"),catchAsync(createTryJewel));

router.get("/auth/list-try-jewel", catchAsync(listTryJewel));

router.post("/auth/list-try-jewel-by-params", catchAsync(listTryJewelByParams));

router.get("/auth/get-try-jewel/:_id", catchAsync(getTryJewel));

router.get("/auth/get-try-jewel-by-productId/:_id", catchAsync(getTryJewelByProduct));

router.put("/auth/update-try-jewel/:_id",upload.single("myFile"), catchAsync(updateTryJewel));

router.delete("/auth/remove-try-jewel/:_id", catchAsync(removeTryJewel));

module.exports = router;
