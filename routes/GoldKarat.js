const express = require("express");

const router = express.Router();

const {
  listGoldKarat,
  createGoldKarat,
  removeGoldKarat,
  updateGoldKarat,
  listGKarat,
  getGoldKarat,
} = require("../controllers/PriceTag/GoldKarat");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/gold-Karat-create", catchAsync(createGoldKarat));

router.get("/auth/list-gold-Karat", catchAsync(listGoldKarat));

router.post("/auth/goldKarat-all", catchAsync(listGKarat));

router.get("/auth/gold-Karat/:_id", catchAsync(getGoldKarat));

router.put("/auth/gold-Karat-update/:_id", catchAsync(updateGoldKarat));

router.delete("/auth/gold-Karat-delete/:_id", catchAsync(removeGoldKarat));

module.exports = router;
