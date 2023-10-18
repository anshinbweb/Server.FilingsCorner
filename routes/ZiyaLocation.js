const express = require("express");
const {
  createZiyaLocation,
  listZiyaLocation,
  listZiyaLocationByParams,
  removeZiyaLocation,
  getZiyaLocation,
  updateZiyaLocation,
  findZiyaLocation,
} = require("../controllers/ZiyaLocation");
const catchAsync = require("../utils/catchAsync");

const multer = require("multer");

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

router.get("/auth/locations/ziya", catchAsync(listZiyaLocation));
router.post(
  "/auth/location/ziya-by-params",
  catchAsync(listZiyaLocationByParams)
);
router.delete(
  "/auth/location/remove-ziya/:_id",
  catchAsync(removeZiyaLocation)
);
router.get("/auth/location/get-ziya/:_id", catchAsync(getZiyaLocation));
router.get(
  "/auth/find-locations/ziya/:country/:city",
  catchAsync(findZiyaLocation)
);

router.post(
  "/auth/location/ziya",
  upload.single("myFile"),
  catchAsync(createZiyaLocation)
);
router.put(
  "/auth/location/update-ziya/:_id",
  upload.single("myFile"),

  catchAsync(updateZiyaLocation)
);

module.exports = router;
