const express = require("express");

const router = express.Router();

const {
  listSilverPrice,
  createSilverPrice,
  removeSilverPrice,
  updateSilverPrice,
  listSPrice,
  getSilverPrice,
} = require("../controllers/PriceTag/SilverPrice");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/silver-price-create", catchAsync(createSilverPrice));

router.get("/auth/list-silver-price", catchAsync(listSilverPrice));

router.post("/auth/silverPrice-all", catchAsync(listSPrice));

router.get("/auth/silver-price/:_id", catchAsync(getSilverPrice));

router.put("/auth/silver-price-update/:_id", catchAsync(updateSilverPrice));

router.delete("/auth/silver-price-delete/:_id", catchAsync(removeSilverPrice));

module.exports = router;
