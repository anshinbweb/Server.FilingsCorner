const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    createEmployeeMaster,
    listEmployeeMaster,
    getEmployeeMasterById,
    deleteEmployeeMaster,
} = require("../controllers/EmployeeMaster/EmployeeMaster");
const { validateAdmin } = require("../middlewares/adminAuth");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/employee");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: multerStorage });

router.post(
    "/auth/employeeMaster/create",
    validateAdmin,
    upload.single("image"),
    createEmployeeMaster
);

router.get("/auth/emplyeeMaster/list", validateAdmin, listEmployeeMaster);

router.get("/auth/employeeMaster/:_id", validateAdmin, getEmployeeMasterById);

router.delete("/auth/employeeMaster/:_id", validateAdmin, deleteEmployeeMaster);

module.exports = router;