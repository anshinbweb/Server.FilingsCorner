const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createUserCart,
  updateQuantity,
  RemoveFromCart,
  getUserCartByUserId,
} = require("../controllers/Auth/User/UserCart");

router.post("/auth/create/user-cart", catchAsync(createUserCart));

router.put("/auth/update/cart-quantity-increment", catchAsync(updateQuantity));

router.put(
  "/auth/remove-cart-item/:userId/:productId",
  catchAsync(RemoveFromCart)
);

router.get("/auth/get/user-cart/:userId", catchAsync(getUserCartByUserId));

module.exports = router;
