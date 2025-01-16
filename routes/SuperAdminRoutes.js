const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
    createSuperAdmin,
    loginSuperAdmin,
    registerCompany,
    getSuperAdmin,
} = require("../controllers/SuperAdminController");
const { validateSuperAdmin } = require("../middlewares/superAdminAuth");

router.post("/auth/create/superadmin", catchAsync(createSuperAdmin));

router.post("/auth/login/superadmin", catchAsync(loginSuperAdmin));

router.get("/auth/getadmin/superadmin", validateSuperAdmin, getSuperAdmin)

module.exports = router;
