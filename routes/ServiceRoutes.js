const express = require("express");
const { validateAdmin } = require("../middlewares/adminAuth");
const {
    createService,
    listServicesByParams,
    deleteService,
    getServiceById,
    updateService,
    listServicesByCompanyId,
} = require("../controllers/ServicesController");

const router = express.Router();

router.post("/auth/create/service", validateAdmin, createService);

router.post(
    "/auth/listbyparams/service/:companyDetailsId",
    validateAdmin,
    listServicesByParams
);

router.delete("/auth/delete/service/:_id", validateAdmin, deleteService);

router.get("/auth/get/service/:_id", validateAdmin, getServiceById);

router.put("/auth/update/service/:_id", validateAdmin, updateService);

router.get(
    "/auth/list/service/:companyDetailsId",
    validateAdmin,
    listServicesByCompanyId
);

module.exports = router;
