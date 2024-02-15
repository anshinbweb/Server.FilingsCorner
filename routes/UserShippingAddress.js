const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createUserShippingAddress,
  listUserShippingAddress,
  listUserShippingAddressByParams,
  getUserShippingAddress,
  updateUserShippingAddress,
  removeUserShippingAddress,
} = require("../controllers/Auth/User/UserShippingAddressMaster");

router.post(
  "/auth/create/user-shipping-address",
  catchAsync(createUserShippingAddress)
);

router.get(
  "/auth/list/user-shipping-address",
  catchAsync(listUserShippingAddress)
);

router.post(
  "/auth/list-by-params/user-shipping-address",
  catchAsync(listUserShippingAddressByParams)
);

router.get(
  "/auth/get/user-shipping-address/:_id",
  catchAsync(getUserShippingAddress)
);

router.put(
  "/auth/update/user-shipping-address/:_id",
  catchAsync(updateUserShippingAddress)
);

router.delete(
  "/auth/remove/user-shipping-address/:_id",
  catchAsync(removeUserShippingAddress)
);

module.exports = router;
