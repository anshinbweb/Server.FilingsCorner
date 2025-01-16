const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
    createAdminUser,
    listAdminUser,
    listAdminUserByParams,
    getAdminUser,
    updateAdminUser,
    removeAdminUser,
    userLoginAdmin,
} = require("../controllers/Auth/User/AdminUsers");
const multer = require("multer");
const { validateAdmin } = require("../middlewares/adminAuth");
const { getSuperAdmin } = require("../controllers/SuperAdminController");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/userImages");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: multerStorage });
router.post(
    "/auth/create/adminUser",
    upload.single("myFile"),
    catchAsync(createAdminUser)
);

router.get("/auth/list/adminUser", validateAdmin, catchAsync(listAdminUser));

router.post(
    "/auth/listByparams/adminUser",
    validateAdmin,
    catchAsync(listAdminUserByParams)
);

router.get("/auth/get/adminUser/:_id", validateAdmin, catchAsync(getAdminUser));

router.put(
    "/auth/update/adminUser/:_id",
    validateAdmin,
    upload.single("myFile"),
    catchAsync(updateAdminUser)
);

router.delete(
    "/auth/remove/adminUser/:_id",
    validateAdmin,
    catchAsync(removeAdminUser)
);

router.post("/adminLogin", catchAsync(userLoginAdmin));

module.exports = router;
