const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  listMediaPlayList,
  createMediaPlayList,
  updateMediaPlayList,
  removeMediaPlayList,
  getMediaPlayList,
  listMediaPlayListByParams,
} = require("../controllers/Media/MediaPlayList/MediaPlayList");

router.get("/auth/list-playlist", catchAsync(listMediaPlayList));
router.post("/auth/create-playlist", catchAsync(createMediaPlayList));
router.put("/auth/update-playlist/:_id", catchAsync(updateMediaPlayList));
router.delete("/auth/remove-playlist/:_id", catchAsync(removeMediaPlayList));
router.get("/auth/get-playlist/:_id", catchAsync(getMediaPlayList));
router.post(
  "/auth/list-playlist-by-params",
  catchAsync(listMediaPlayListByParams)
);

module.exports = router;
