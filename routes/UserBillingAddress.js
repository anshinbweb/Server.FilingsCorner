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
  AddUpdateBillingAddress,
  listActiveBillingAddress,
  getAllBillingAddressofUser,
  updateDefaultBillingAddress,
} = require("../controllers/Auth/User/UserBillingAddressMaster");

router.post(
  "/auth/create/userBillingAddress",
  catchAsync(createUserBillingAddress)
);

// APP
router.get(
  "/auth/listActive/userBillingAddress",
  catchAsync(listActiveBillingAddress)
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

router.get(
  "/auth/get/allBillingAddress/:userId",
  catchAsync(getAllBillingAddressofUser)
);

router.post(
  "/auth/updateDefaultBillAdd/:userId/:addressId",
  catchAsync(updateDefaultBillingAddress)
);

router.put(
  "/auth/update/userBillingAddress/:_id",
  catchAsync(updateUserBillingAddress)
);

router.delete(
  "/auth/remove/userBillingAddress/:_id",
  catchAsync(removeUserBillingAddress)
);

// APP
router.post(
  "/auth/addUpdate/userBillingAddress",
  catchAsync(AddUpdateBillingAddress)
);
module.exports = router;
