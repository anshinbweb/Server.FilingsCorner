const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createParameterMaster,
  listParameterMaster,
  listParameterMasterByParams,
  getParameterMaster,
  updateParameterMaster,
  removeParameterMaster,
} = require("../controllers/Products/ProductParameters/ParameterMaster");

router.post("/auth/create/parameterMaster", catchAsync(createParameterMaster));

router.get("/auth/list/parameterMaster", catchAsync(listParameterMaster));

router.post(
  "/auth/list-by-params/parameterMaster",
  catchAsync(listParameterMasterByParams)
);

router.get("/auth/get/parameterMaster/:_id", catchAsync(getParameterMaster));

router.put(
  "/auth/update/parameterMaster/:_id",
  catchAsync(updateParameterMaster)
);

router.delete(
  "/auth/remove/parameterMaster/:_id",
  catchAsync(removeParameterMaster)
);

module.exports = router;
