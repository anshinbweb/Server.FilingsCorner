const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  createUserSubscription,
  listUserSubscription,
  listUserSubscriptionByParams,
  getUserSubscription,
  updateUserSubscription,
  removeUserSubscription,
} = require("../controllers/Subscription/UserSubscription");

router.post(
  "/auth/create/UserSubscription",
  catchAsync(createUserSubscription)
);

router.get("/auth/list/UserSubscription", catchAsync(listUserSubscription));

router.post(
  "/auth/list-by-params/UserSubscription",
  catchAsync(listUserSubscriptionByParams)
);

router.get("/auth/get/UserSubscription/:_id", catchAsync(getUserSubscription));

router.put(
  "/auth/update/UserSubscription/:_id",
  catchAsync(updateUserSubscription)
);

router.delete(
  "/auth/remove/UserSubscription/:_id",
  catchAsync(removeUserSubscription)
);

module.exports = router;
