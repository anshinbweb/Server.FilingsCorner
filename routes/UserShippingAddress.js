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
  AddUpdateShippingAddress,
} = require("../controllers/Auth/User/UserShippingAddressMaster");

router.post(
  "/auth/create/userShippingAddress",
  catchAsync(createUserShippingAddress)
);

router.get(
  "/auth/list/userShippingAddress",
  catchAsync(listUserShippingAddress)
);

router.post(
  "/auth/list-by-params/userShippingAddress",
  catchAsync(listUserShippingAddressByParams)
);

router.get(
  "/auth/get/userShippingAddress/:_id",
  catchAsync(getUserShippingAddress)
);

router.put(
  "/auth/update/userShippingAddress/:_id",
  catchAsync(updateUserShippingAddress)
);

router.delete(
  "/auth/remove/userShippingAddress/:_id",
  catchAsync(removeUserShippingAddress)
);

// APP
router.post(
  "/auth/addUpdate/userShippingAddress",
  catchAsync(AddUpdateShippingAddress)
);

module.exports = router;
