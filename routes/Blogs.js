const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const {
  createBlogs,
  listBlogs,
  listBlogsByParams,
  getBlogs,
  updateBlogs,
  removeBlogs,
} = require("../controllers/Blogs/Blogs");

const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/blogs",
  upload.single("myFile"),
  catchAsync(createBlogs)
);

router.get("/auth/list/blogs", catchAsync(listBlogs));

router.post("/auth/list-by-params/blogs", catchAsync(listBlogsByParams));

router.get("/auth/get/blogs/:_id", catchAsync(getBlogs));

router.put(
  "/auth/update/blogs/:_id",
  upload.single("myFile"),

  catchAsync(updateBlogs)
);

router.delete("/auth/remove/blogs/:_id", catchAsync(removeBlogs));

const multerStorageCK = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/BlogCKImages");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const uploadCk = multer({ storage: multerStorageCK });

//upload images
router.post(
  "/auth/cms-blog/image-upload",
  uploadCk.single("uploadImg"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);

module.exports = router;
