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
  getPartnerLoginData,
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

router.get("/auth/locations/ziya", catchAsync(listLocation));
router.post("/auth/location/ziya-by-params", catchAsync(listLocationByParams));
router.delete("/auth/location/remove-ziya/:_id", catchAsync(removeLocation));
router.get("/auth/location/get-ziya/:_id", catchAsync(getLocation));
router.get(
  "/auth/find-locations/ziya/:country/:city",
  catchAsync(findLocation)
);

router.get(
  "/auth/find-partner-user-details/:username/:password",
  catchAsync(getPartnerLoginData)
);

router.post(
  "/auth/location/ziya",
  upload.single("myFile"),
  catchAsync(createLocation)
);
router.put(
  "/auth/location/update-ziya/:_id",
  upload.single("myFile"),

  catchAsync(updateLocation)
);

module.exports = router;
