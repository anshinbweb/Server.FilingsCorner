const express = require("express");
const catchAsync = require("../utils/catchAsync");
const {
  createuserNotifcation,
  listuserNotification,
  getuserAllNotification,
  listuserNotifcationByparams,
  updateUserNotification,
  removeUserNotification,
  getNotification,
} = require("../controllers/userNotifications/userNotification");

const router = express.Router();

router.post("/auth/createUserNotification", catchAsync(createuserNotifcation));
router.put(
  "/auth/updateUserNotification/:_id",
  catchAsync(updateUserNotification)
);
router.delete(
  "/auth/removeUserNotification/:_id",
  catchAsync(removeUserNotification)
);

router.post("/auth/listUserNotification", catchAsync(listuserNotification));
router.post(
  "/auth/listNotificationParams",
  catchAsync(listuserNotifcationByparams)
);
router.get(
  "/auth/getUserNotificationAll/:_id",
  catchAsync(getuserAllNotification)
);

router.get("/auth/getNotification/:_id", catchAsync(getNotification));
module.exports = router;
