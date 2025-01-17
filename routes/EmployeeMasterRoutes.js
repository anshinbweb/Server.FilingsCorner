const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    createEmployeeMaster,
    listEmployeeMasterByCompany,
    listEmployeesMasterByParams,
    getEmployeeMasterById,
    updateEmployeeMaster,
    deleteEmployeeMaster,
} = require("../controllers/EmployeeMaster/EmployeeMaster");

const { validateAdmin } = require("../middlewares/adminAuth");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/employeeMaster");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: multerStorage });

router.post(
    "/auth/create/employee-master",
    validateAdmin,
    upload.single("photo"),
    createEmployeeMaster
);

router.get(
    "/auth/get/employee-master/:companyDetailsId",
    validateAdmin,
    listEmployeeMasterByCompany
);

router.post(
    "/auth/listbyparams/employee-master/:companyDetailsId",
    validateAdmin,
    listEmployeesMasterByParams
);

router.get(
    "/auth/getbyid/employee-master/:_id",
    validateAdmin,
    getEmployeeMasterById
);

router.put(
    "/auth/update/employee-master/:_id",
    validateAdmin,
    upload.single("updatedPhoto"),
    updateEmployeeMaster
);

router.delete(
    "/auth/delete/employee-master/:_id",
    validateAdmin,
    deleteEmployeeMaster
);

module.exports = router;
