const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createPolicyMaster,
  listPolicyMaster,
  listPolicyMasterByParams,
  getPolicyMaster,
  updatePolicyMaster,
  removePolicyMaster,
} = require("../controllers/PolicyAndInquiry/PolicyMaster");

router.post("/auth/create/policyMaster", catchAsync(createPolicyMaster));

router.get("/auth/list/policyMaster", catchAsync(listPolicyMaster));

router.post("/auth/list-by-params/policyMaster", catchAsync(listPolicyMasterByParams));

router.get("/auth/get/policyMaster/:_id", catchAsync(getPolicyMaster));

router.put("/auth/update/policyMaster/:_id", catchAsync(updatePolicyMaster));

router.delete("/auth/remove/policyMaster/:_id", catchAsync(removePolicyMaster));

module.exports = router;
