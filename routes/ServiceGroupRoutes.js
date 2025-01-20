const express = require("express");
const { validateAdmin } = require("../middlewares/adminAuth");
const {
    createServiceGroup,
    listServiceGroupsByCompany,
    getServiceGroupById,
    updateServiceGroup,
    deleteServiceGroup,
    listServiceGroupsByParams,
} = require("../controllers/ServiceGroupController");

const router = express.Router();

router.post("/auth/create/service-group", validateAdmin, createServiceGroup);

router.get(
    "/auth/listbycompany/service-group/:companyDetailsId",
    validateAdmin,
    listServiceGroupsByCompany
);

router.get("/auth/get/service-group/:id", validateAdmin, getServiceGroupById);

router.put("/auth/update/service-group/:id", validateAdmin, updateServiceGroup);

router.delete(
    "/auth/delete/service-group/:id",
    validateAdmin,
    deleteServiceGroup
);

router.post(
    "/auth/listbyparams/service-group/:companyDetailsId",
    validateAdmin,
    listServiceGroupsByParams
);

module.exports = router;
