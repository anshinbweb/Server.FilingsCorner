const express = require("express");
const catchAsync = require("../utils/catchAsync");
const {
  createuserNotifcation,
  listuserNotification,
  getuserAllNotification,
  listuserNotifcationByparams,
  updateUserNotification,
  removeUserNotification,
  getuserNotification,
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
router.get(
  "/auth/listNotificationParams",
  catchAsync(listuserNotifcationByparams)
);
router.get(
  "/auth/getUserNotificationAll/:_id",
  catchAsync(getuserAllNotification)
);

router.get("/auth/getUserNotification/:_id", catchAsync(getuserNotification));
module.exports = router;
