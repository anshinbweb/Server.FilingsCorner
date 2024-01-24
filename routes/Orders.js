const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createOrders,
  listOrders,
  listOrdersByParams,
  getOrders,
  updateOrders,
  removeOrders,
} = require("../controllers/Products/Orders");

router.post("/auth/create/orders", catchAsync(createOrders));

router.get("/auth/list/orders", catchAsync(listOrders));

router.post("/auth/list-by-params/orders", catchAsync(listOrdersByParams));

router.get("/auth/get/orders/:_id", catchAsync(getOrders));

router.put("/auth/update/orders/:_id", catchAsync(updateOrders));

router.delete("/auth/remove/orders/:_id", catchAsync(removeOrders));

module.exports = router;
