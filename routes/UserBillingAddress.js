const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createUserBillingAddress,
  listUserBillingAddress,
  listUserBillingAddressByParams,
  getUserBillingAddress,
  updateUserBillingAddress,
  removeUserBillingAddress,
} = require("../controllers/Auth/User/UserBillingAddressMaster");

router.post(
  "/auth/create/user-billing-address",
  catchAsync(createUserBillingAddress)
);

router.get(
  "/auth/list/user-billing-address",
  catchAsync(listUserBillingAddress)
);

router.post(
  "/auth/list-by-params/user-billing-address",
  catchAsync(listUserBillingAddressByParams)
);

router.get(
  "/auth/get/user-billing-address/:_id",
  catchAsync(getUserBillingAddress)
);

router.put(
  "/auth/update/user-billing-address/:_id",
  catchAsync(updateUserBillingAddress)
);

router.delete(
  "/auth/remove/user-billing-address/:_id",
  catchAsync(removeUserBillingAddress)
);

module.exports = router;
