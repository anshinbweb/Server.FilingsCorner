const express = require("express");
const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const {
  listLocation,
  listLocationByParams,
  removeLocation,
  getLocation,
  findLocation,
  createLocation,
  updateLocation,
} = require("../controllers/Location/CompanyLocation");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/StoreLogo");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

const router = express.Router();


router.get("/auth/list/company-locations", catchAsync(listLocation));
router.post(
  "/auth/list-by-params/company-locations",
  catchAsync(listLocationByParams)
);
router.delete(
  "/auth/remove/company-locations/:_id",
  catchAsync(removeLocation)
);
router.get("/auth/get/company-locations/:_id", catchAsync(getLocation));
router.get(
  "/auth/find/company-locations/:country/:city",
  catchAsync(findLocation)
);

router.post(
  "/auth/create/company-locations",
  upload.single("myFile"),
  catchAsync(createLocation)
);
router.put(
  "/auth/update/company-locations/:_id",
  upload.single("myFile"),
  catchAsync(updateLocation)
);

module.exports = router;
