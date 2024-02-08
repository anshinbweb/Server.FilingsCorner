const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const { createOrderDetails } = require("../controllers/Products/OrderDetails");

router.post("/auth/create/order-details", catchAsync(createOrderDetails));

module.exports = router;
