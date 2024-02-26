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
  userLogin,
  ChangePasswordUser,
  updateDefaultAddress,
} = require("../controllers/Auth/User/Users");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/userImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/users",
  upload.single("myFile"),
  catchAsync(createUsers)
);

router.post("/auth/user-change-password", catchAsync(ChangePasswordUser));

router.get("/auth/list/users", catchAsync(listUsers));

router.post("/auth/list-by-params/users", catchAsync(listUsersByParams));

router.get("/auth/get/users/:_id", catchAsync(getUsers));

router.put(
  "/auth/update/users/:_id",
  upload.single("myFile"),
  catchAsync(updateUsers)
);

router.post(
  "/auth/update-defualt-address/:userId/:addressId",
  catchAsync(updateDefaultAddress)
);

router.delete("/auth/remove/users/:_id", catchAsync(removeUsers));

router.post("/login", catchAsync(userLogin));

module.exports = router;
