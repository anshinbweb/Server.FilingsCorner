///////////////////////PROSPECTS ////////////////////////

const express = require("express");

const router = express.Router();

const {
  listProspect,
  createProspect,
  getProspect,
  removeProspect,
  updateProspect,
  getUserByWP,
  listProspectByParams,
  AddToWhislist,
  RemoveFromWhislist,
  GetWhishlistUser,
} = require("../controllers/Prospect/Prospect");
const catchAsync = require("../utils/catchAsync");

router.get("/auth/prospect-list", catchAsync(listProspect));
router.post("/auth/prospect-list-all", catchAsync(listProspectByParams));
router.post("/auth/add-whislist-Items", catchAsync(AddToWhislist));

router.post("/auth/remove-whislist-Items", catchAsync(RemoveFromWhislist));

router.get(
  "/auth/get-whislist-Items-user/:userid",
  catchAsync(GetWhishlistUser)
);

router.post("/auth/prospect-create", catchAsync(createProspect));

router.get("/auth/get-prospect/:_id", catchAsync(getProspect));
router.get("/auth/prospect-login/:ContactNo", catchAsync(getUserByWP));

router.delete("/auth/prospect-remove/:_id", catchAsync(removeProspect));

router.put("/auth/prospect-update/:user", catchAsync(updateProspect));

module.exports = router;
