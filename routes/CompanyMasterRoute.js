const express = require("express");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const {
    createCompanyMaster,
    listCompanyMaster,
    getCompanyMasterById,
    listCompanyMasterByParams,
    deleteCompanyMaster,
    updateCompanyMaster,
} = require("../controllers/CompanyMaster/CompanyMasterController");
const { validateAdmin } = require("../middlewares/adminAuth");
const { validateSuperAdmin } = require("../middlewares/superAdminAuth");

const router = express.Router();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/companyMaster");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const upload = multer({ storage: multerStorage });

const uploadFields = upload.fields([
    { name: "Favicon", maxCount: 1 },
    { name: "Icon", maxCount: 1 },
    { name: "Logo", maxCount: 1 },
    { name: "DigitalSignature", maxCount: 1 },
]);

const updatedUploadFields = upload.fields([
    { name: "FaviconUpdated", maxCount: 1 },
    { name: "IconUpdated", maxCount: 1 },
    { name: "LogoUpdated", maxCount: 1 },
    { name: "DigitalSignatureUpdated", maxCount: 1 },
]);

router.post(
    "/auth/create/company-master",
    validateSuperAdmin,
    uploadFields,
    catchAsync(createCompanyMaster)
);

router.get(
    "/list/company-master",
    validateSuperAdmin,
    catchAsync(listCompanyMaster)
);

router.get(
    "/company-master/:_id",
    validateSuperAdmin,
    catchAsync(getCompanyMasterById)
);

router.post(
    "/listbyparams/company-master",
    validateSuperAdmin,
    catchAsync(listCompanyMasterByParams)
);

router.delete(
    "/remove/company-master/:_id",
    validateSuperAdmin,
    catchAsync(deleteCompanyMaster)
);

router.put(
    "/update/company-master/:_id",
    validateSuperAdmin,
    updatedUploadFields,
    catchAsync(updateCompanyMaster)
);

module.exports = router;
