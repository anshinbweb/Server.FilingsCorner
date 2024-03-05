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
  createOrderInOneGo,
  getLatestOrderByUser,
} = require("../controllers/Products/Orders/OrderNew");

router.post("/auth/create/orders", catchAsync(createOrders));

router.post("/auth/create/orders-in-one-go", catchAsync(createOrderInOneGo));

router.get("/auth/list/orders", catchAsync(listOrders));

router.post("/auth/list-by-params/orders", catchAsync(listOrdersByParams));

router.get("/auth/get/orders/:_id", catchAsync(getOrders));

router.put("/auth/update/orders/:_id", catchAsync(updateOrders));

router.delete("/auth/remove/orders/:_id", catchAsync(removeOrders));

router.get(
  "/auth/get/orders-by-user-id/:userId",
  catchAsync(getOrdersByUserId)
);

router.put("/auth/update/order-status/:_id", catchAsync(updateOrderStatus));

router.put("/auth/update/delivery-date/:_id", catchAsync(updateDeliveryDate));

router.get(
  "/auth/get/latest-order-by-user/:userId",
  catchAsync(getLatestOrderByUser)
);

module.exports = router;
