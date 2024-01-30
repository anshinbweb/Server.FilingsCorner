const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createUsers,
  listUsers,
  listUsersByParams,
  getUsers,
  updateUsers,
  removeUsers,
} = require("../controllers/Auth/Users");

router.post("/auth/create/users", catchAsync(createUsers));

router.get("/auth/list/users", catchAsync(listUsers));

router.post("/auth/list-by-params/users", catchAsync(listUsersByParams));

router.get("/auth/get/users/:_id", catchAsync(getUsers));

router.put("/auth/update/users/:_id", catchAsync(updateUsers));

router.delete("/auth/remove/users/:_id", catchAsync(removeUsers));

module.exports = router;
