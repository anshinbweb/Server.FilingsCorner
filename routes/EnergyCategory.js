const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createEnergyMaster,
  listEnergyMaster,
  listEnergyMasterByParams,
  getEnergyMaster,
  updateEnergyMaster,
  removeEnergyMaster,
  listActiveEnergyCategories,
} = require("../controllers/Category/EnergyMaster");

router.post("/auth/create/energy-category", catchAsync(createEnergyMaster));

router.get("/auth/list/energy-category", catchAsync(listEnergyMaster));

router.get(
  "/auth/list-active/energy-category",
  catchAsync(listActiveEnergyCategories)
);

router.post(
  "/auth/list-by-params/energy-category",
  catchAsync(listEnergyMasterByParams)
);

router.get("/auth/get/energy-category/:_id", catchAsync(getEnergyMaster));

router.put("/auth/update/energy-category/:_id", catchAsync(updateEnergyMaster));

router.delete(
  "/auth/remove/energy-category/:_id",
  catchAsync(removeEnergyMaster)
);

module.exports = router;
