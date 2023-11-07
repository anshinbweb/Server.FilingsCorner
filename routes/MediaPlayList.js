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
// const {
//   listPublishPlayList,
//   createPublishPlayList,
//   updatePublishPlayList,
//   removePublishPlayList,
//   getPublishPlayList,
//   listPublishPlayListByParams,
//   listPublishPlayListByParamsSH,
//   pausePublishMediaPlaylist,
// } = require("../controllers/Media/MediaPlayList/PublishPlayList");

router.get("/auth/list-playlist", catchAsync(listMediaPlayList));
router.post("/auth/create-playlist", catchAsync(createMediaPlayList));
router.put("/auth/update-playlist/:_id", catchAsync(updateMediaPlayList));
router.delete("/auth/remove-playlist/:_id", catchAsync(removeMediaPlayList));
router.get("/auth/get-playlist/:_id", catchAsync(getMediaPlayList));
router.post(
  "/auth/list-playlist-by-params",
  catchAsync(listMediaPlayListByParams)
);

// router.get("/auth/list-publish-playlist", catchAsync(listPublishPlayList));
// router.post("/auth/create-publish-playlist", catchAsync(createPublishPlayList));
// router.put(
//   "/auth/update-publish-playlist/:_id",
//   catchAsync(updatePublishPlayList)
// );
// router.delete(
//   "/auth/remove-publish-playlist/:_id",
//   catchAsync(removePublishPlayList)
// );
// router.get("/auth/get-publish-playlist/:_id", catchAsync(getPublishPlayList));
// router.post(
//   "/auth/list-publish-playlist-by-params",
//   catchAsync(listPublishPlayListByParams)
// );
// router.post(
//   "/auth/stakeholder/list-publish-playlist-by-params",
//   catchAsync(listPublishPlayListByParamsSH)
// );
// router.put(
//   "/auth/pause-media-playlist/:_id",
//   catchAsync(pausePublishMediaPlaylist)
// );

module.exports = router;
