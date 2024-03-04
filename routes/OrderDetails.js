const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createOrderDetails,
  getOrderDetails,
  updateOrderDetails,
  removeOrderDetails,
  listOrderDetails,
  listOrderDetailsByParams,
  getOrderDetailsByOrderId,
} = require("../controllers/Products/Orders/OrderDetailsNew");

router.post("/auth/create/order-details", catchAsync(createOrderDetails)); // input must be an array

router.get("/auth/get/order-details/:_id", catchAsync(getOrderDetails));

router.post(
  "/auth/list-by-params/order-details",
  catchAsync(listOrderDetailsByParams)
);

router.put("/auth/update/order-details/:_id", catchAsync(updateOrderDetails));

router.delete(
  "/auth/remove/order-details/:_id",
  catchAsync(removeOrderDetails)
);

router.get("/auth/list/order-details", catchAsync(listOrderDetails));

router.get(
  "/auth/get/order-details-by-order-id/:_id",
  catchAsync(getOrderDetailsByOrderId)
);

module.exports = router;
