const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createUserCart,
  updateQuantity,
  RemoveFromCart,
} = require("../controllers/Auth/UserCart");

router.post("/auth/create/user-cart", catchAsync(createUserCart));

router.put(
  "/auth/update/cart-quantity-increment/:userId/:productId/:counterValue",
  catchAsync(updateQuantity)
);

router.put(
  "/auth/remove-cart-item/:userId/:productId",
  catchAsync(RemoveFromCart)
);

module.exports = router;
