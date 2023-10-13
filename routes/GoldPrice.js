const express = require("express");

const router = express.Router();

const {
  listGoldPrice,
  createGoldPrice,
  removeGoldPrice,
  updateGoldPrice,
  listGPrice,
  getGoldPrice,
  listLatestGoldPrice,
} = require("../controllers/PriceTag/GoldPrice");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/gold-price-create", catchAsync(createGoldPrice));

router.get("/auth/list-gold-price", catchAsync(listGoldPrice));

router.get("/auth/list-latest-gold-price", catchAsync(listLatestGoldPrice));

router.post("/auth/goldPrice-all", catchAsync(listGPrice));

router.get("/auth/gold-price/:_id", catchAsync(getGoldPrice));

router.put("/auth/gold-price-update/:_id", catchAsync(updateGoldPrice));

router.delete("/auth/gold-price-delete/:_id", catchAsync(removeGoldPrice));

module.exports = router;
