const express = require("express");
const multer = require("multer");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { getCompanyDetailsById, updateCompanyDetails, loginCompany } = require("../controllers/CompanyDetailsController");
const { validateAdmin } = require("../middlewares/adminAuth");

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

const updatedUploadFields = upload.fields([
  { name: "FaviconUpdated", maxCount: 1 },
  { name: "IconUpdated", maxCount: 1 },
  { name: "LogoUpdated", maxCount: 1 },
  { name: "DigitalSignatureUpdated", maxCount: 1 },
]);

router.get("/auth/get/company-details/:_id", validateAdmin,catchAsync(getCompanyDetailsById));

router.put("/auth/update/company-details/:_id", validateAdmin, updatedUploadFields, catchAsync(updateCompanyDetails));

router.post("/auth/login/company", catchAsync(loginCompany));

module.exports = router;
