const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createAdminUser,
  listAdminUser,
  listAdminUserByParams,
  getAdminUser,
  updateAdminUser,
  removeAdminUser,
  userLoginAdmin,
} = require("../controllers/Auth/User/AdminUsers");

router.post("/auth/create/adminUser", catchAsync(createAdminUser));

router.get("/auth/list/adminUser", catchAsync(listAdminUser));

router.post("/auth/listByparams/adminUser", catchAsync(listAdminUserByParams));

router.get("/auth/get/adminUser/:_id", catchAsync(getAdminUser));

router.put("/auth/update/adminUser/:_id", catchAsync(updateAdminUser));

router.delete("/auth/remove/adminUser/:_id", catchAsync(removeAdminUser));

router.post("/adminLogin", catchAsync(userLoginAdmin));

module.exports = router;
