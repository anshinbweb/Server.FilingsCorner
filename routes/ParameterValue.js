const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createParameterValue,
  listParameterValue,
  listParameterValueByParams,
  getParameterValue,
  updateParameterValue,
  removeParameterValue,
  listActiveParameterValue,
} = require("../controllers/Products/ProductParameters/ParameterValue");

router.post("/auth/create/parameterValue", catchAsync(createParameterValue));

router.get("/auth/list/parameterValue", catchAsync(listParameterValue));

router.get(
  "/auth/listActive/parameterValue",
  catchAsync(listActiveParameterValue)
);

router.post(
  "/auth/list-by-params/parameterValue",
  catchAsync(listParameterValueByParams)
);

router.get("/auth/get/parameterValue/:_id", catchAsync(getParameterValue));

router.put(
  "/auth/update/parameterValue/:_id",
  catchAsync(updateParameterValue)
);

router.delete(
  "/auth/remove/parameterValue/:_id",
  catchAsync(removeParameterValue)
);

module.exports = router;
