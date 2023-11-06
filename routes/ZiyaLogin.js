const express = require("express");

const router = express.Router();

const { createZiyaLogin, listZiyaLogin } = require("../controllers/ZiyaLogin");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/Ziya-login-create", catchAsync(createZiyaLogin));

router.get("/auth/ziya-list-login", catchAsync(listZiyaLogin));

module.exports = router;
