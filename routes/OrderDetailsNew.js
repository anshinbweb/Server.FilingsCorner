const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createOrderDetails,
  getOrderDetails,
  updateOrderDetails,
  removeOrderDetails,
  listOrderDetails,
  getOrderDetailsByOrderId,
} = require("../controllers/Products/OrderDetailsNew");

router.post("/auth/create/order-details-new", catchAsync(createOrderDetails)); // input must be an array

router.get("/auth/get/order-details-new/:_id", catchAsync(getOrderDetails));

router.put(
  "/auth/update/order-details-new/:_id",
  catchAsync(updateOrderDetails)
);

router.delete(
  "/auth/remove/order-details-new/:_id",
  catchAsync(removeOrderDetails)
);

router.get("/auth/list/order-details-new", catchAsync(listOrderDetails));

router.get(
  "/auth/get/order-details-by-order-id/:_id",
  catchAsync(getOrderDetailsByOrderId)
);

module.exports = router;
