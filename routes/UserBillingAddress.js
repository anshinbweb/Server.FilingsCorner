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
  "/auth/create/userBillingAddress",
  catchAsync(createUserBillingAddress)
);

router.get("/auth/list/userBillingAddress", catchAsync(listUserBillingAddress));

router.post(
  "/auth/list-by-params/userBillingAddress",
  catchAsync(listUserBillingAddressByParams)
);

router.get(
  "/auth/get/userBillingAddress/:_id",
  catchAsync(getUserBillingAddress)
);

router.put(
  "/auth/update/userBillingAddress/:_id",
  catchAsync(updateUserBillingAddress)
);

router.delete(
  "/auth/remove/userBillingAddress/:_id",
  catchAsync(removeUserBillingAddress)
);

module.exports = router;
