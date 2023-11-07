const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const fs = require("fs");
const multer = require("multer");
const {
  createManageMedia,
  listManageMedia,
  listManageMediaByParams,
  getManageMedia,
  updateManageMedia,
  removeManageMedia,
} = require("../controllers/Media/ManageMedia");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/ManageMedia");
  },

  filename: (req, file, cb) => {
    console.log("file name in route", file.fieldname);
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// if (!fs.existsSync("uploads/ManageMedia")) {
//   fs.mkdirSync("uploads/ManageMedia");
// }

router.post(
  "/auth/create-media",
  upload.single("Media"),
  catchAsync(createManageMedia)
);

router.get("/auth/list-media", catchAsync(listManageMedia));

router.post("/auth/list-media-by-params", catchAsync(listManageMediaByParams));

router.get("/auth/get-media/:_id", catchAsync(getManageMedia));

router.put(
  "/auth/update-media/:_id",
  upload.single("Media"),
  catchAsync(updateManageMedia)
);

router.delete("/auth/remove-media/:_id", catchAsync(removeManageMedia));

module.exports = router;
