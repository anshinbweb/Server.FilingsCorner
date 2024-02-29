const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createOrders,
  listOrders,
  listOrdersByParams,
  getOrders,
  updateOrders, // is this possible?
  removeOrders,
  getOrdersByUserId,
  updateOrderStatus,
  updateDeliveryDate,
} = require("../controllers/Products/OrderNew");

router.post("/auth/create/orders-new", catchAsync(createOrders));

router.get("/auth/list/orders-new", catchAsync(listOrders));

router.post("/auth/list-by-params/orders-new", catchAsync(listOrdersByParams));

router.get("/auth/get/orders-new/:_id", catchAsync(getOrders));

router.put("/auth/update/orders-new/:_id", catchAsync(updateOrders));

router.delete("/auth/remove/orders-new/:_id", catchAsync(removeOrders));

router.get("/auth/get/orders-by-user-id/:_id", catchAsync(getOrdersByUserId));

router.put("/auth/update/order-status/:_id", catchAsync(updateOrderStatus));

router.put("/auth/update/delivery-date/:_id", catchAsync(updateDeliveryDate));

module.exports = router;
