const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createUserCart,
  updateQuantity,
  RemoveFromCart,
  getUserCartByUserId,
  increaseQuantityOne,
  decreaseQuantityOne,
} = require("../controllers/Auth/User/UserCart");

router.post("/auth/create/user-cart", catchAsync(createUserCart));

router.put("/auth/update/cart-quantity-increment", catchAsync(updateQuantity));

router.put("/auth/remove-cart-item", catchAsync(RemoveFromCart));

router.get("/auth/get/user-cart/:userId", catchAsync(getUserCartByUserId));

router.put(
  "/auth/update/cart-quantity-increment-one",
  catchAsync(increaseQuantityOne)
);

router.put(
  "/auth/update/cart-quantity-decrement-one",
  catchAsync(decreaseQuantityOne)
);

module.exports = router;
