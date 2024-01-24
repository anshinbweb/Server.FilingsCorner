const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createSubscriptionMaster,
  listSubscriptionMaster,
  listSubscriptionMasterByParams,
  getSubscriptionMaster,
  updateSubscriptionMaster,
  removeSubscriptionMaster,
} = require("../controllers/Subscription/SubscriptionMaster");

router.post("/auth/create/SubscriptionMaster", catchAsync(createSubscriptionMaster));

router.get("/auth/list/SubscriptionMaster", catchAsync(listSubscriptionMaster));

router.post(
  "/auth/list-by-params/SubscriptionMaster",
  catchAsync(listSubscriptionMasterByParams)
);

router.get("/auth/get/SubscriptionMaster/:_id", catchAsync(getSubscriptionMaster));

router.put("/auth/update/SubscriptionMaster/:_id", catchAsync(updateSubscriptionMaster));

router.delete("/auth/remove/SubscriptionMaster/:_id", catchAsync(removeSubscriptionMaster));

module.exports = router;
