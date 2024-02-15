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
} = require("../controllers/Auth/AdminUser");

router.post("/auth/create/admin-user", catchAsync(createAdminUser));

router.get("/auth/list/admin-user", catchAsync(listAdminUser));

router.post(
  "/auth/list-by-params/admin-user",
  catchAsync(listAdminUserByParams)
);

router.get("/auth/get/admin-user/:_id", catchAsync(getAdminUser));

router.put("/auth/update/admin-user/:_id", catchAsync(updateAdminUser));

router.delete("/auth/remove/admin-user/:_id", catchAsync(removeAdminUser));

router.post("/admin-login", catchAsync(userLoginAdmin));

module.exports = router;
