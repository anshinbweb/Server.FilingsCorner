const Category = require("../../models/Products/Category");
const sharp = require("sharp"); // Import the sharp library
const fs = require("fs").promises; // Import the 'fs.promises' module

exports.listCategory = async (req, res) => {
  try {
    const list = await Category.find().exec();
    res.json(list);
  } catch (error) {
    console.log("get Error creating category", error);
    return res.status(400).send("Failed to get dynamic content for category.");
  }
};

exports.createCategory = async (req, res) => {
  try {
    console.log("create", req.body);

    //   let CategoryImage = req.files.CategoryImage;

    let CategoryImage = req.file
      ? `uploads/Category/${req.file.filename}`
      : null;

    if (CategoryImage) {
      const tempResizedImage = `uploads/Category/temp_${req.file.filename}`;

      await sharp(CategoryImage)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
        })
        .toFile(tempResizedImage);

      // Remove the original image
      await fs.unlink(CategoryImage);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedImage, CategoryImage);
    }

    console.log(CategoryImage);

    let { Description, isActive } = req.body;

    const add = await new Category({
      Category: req.body.Category,
      // CategoryImage: `uploads/Category/${CategoryImage.filename}`,
      CategoryImage: CategoryImage,
      Description,
      isActive,
    }).save();
    res.json(add);
  } catch (err) {
    console.log(err);
    res.status(400).json({ isOk: false, message: err });
  }
};

exports.listCategoryByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { isActive: IsActive },
      },
      {
        $match: {
          $or: [
            {
              Category: new RegExp(match, "i"),
            },
            {
              Description: new RegExp(match, "i"),
            },
          ],
        },
      },
      {
        $facet: {
          stage1: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
              },
            },
          ],
          stage2: [
            {
              $skip: skip,
            },
            {
              $limit: per_page,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$stage1",
        },
      },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      },
    ];
    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    } else {
      let sort = {};
      sort["createdAt"] = -1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    }

    const list = await Category.aggregate(query);
    console.log("list Category by  params", list);
    res.json(list);
  } catch (error) {
    console.log("display error in categiry list", error);
    res.status(400).send("Error in fetching data.");
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const del = await Category.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete Category failed");
  }
};

exports.getCategory = async (req, res) => {
  try {
    const state = await Category.findOne({ _id: req.params._id }).exec();
    console.log("get Category", state);
    res.json(state);
  } catch (error) {
    console.log("error in get category", error);
    res.status(400).send("get Category failed");
  }
};

exports.updateCategory = async (req, res) => {
  try {
    console.log("update", req.body);
    let CategoryImage = req.file
      ? `uploads/Category/${req.file.filename}`
      : null;

    let fieldvalues = { ...req.body };
    if (CategoryImage != null) {
      // Create a temporary file path for the resized image
      const tempResizedImage = `uploads/Category/temp_${req.file.filename}`;

      await sharp(CategoryImage)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
        })
        .toFile(tempResizedImage);

      // Remove the original image
      await fs.unlink(CategoryImage);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedImage, CategoryImage);

      fieldvalues.CategoryImage = CategoryImage;
    }

    const update = await Category.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update  failed");
  }
};
