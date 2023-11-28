const CategoryProducts = require("../../models/Products/CategoryProducts");
// const fs = require("fs");
const sharp = require("sharp"); // Import the sharp library
const fs = require("fs").promises; // Import the 'fs.promises' module

exports.listCategoryProducts = async (req, res) => {
  try {
    const list = await CategoryProducts.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log("error in get category p", error);
    res.status(400).send("get Category p failed");
  }
};

exports.createCategoryProducts = async (req, res) => {
  try {
    console.log("body", req.body);
    let ProductImage = req.file
      ? `uploads/CategoryProducts/${req.file.filename}`
      : null;

    console.log("PP", ProductImage);
    if (ProductImage) {
      const tempResizedImageCP = `uploads/CategoryProducts/tempCP_${req.file.filename}`;

      await sharp(ProductImage)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
          background: "white", // Set background color to white
          // background: { r: 255, g: 255, b: 255, alpha: 1 }, // Set background color to white
        })
        .toFile(tempResizedImageCP);

      // Remove the original image
      await fs.unlink(ProductImage);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedImageCP, ProductImage);
    }

    let { Category, ProductName, isActive } = req.body;

    const add = await new CategoryProducts({
      Category,
      ProductName,
      isActive,
      ProductImage,
    }).save();
    console.log("create location", add);
    res.status(200).json({ isOk: true, data: add, message: "" });
    //   }
  } catch (err) {
    console.log("error in create", err);
    res
      .status(400)
      .json({ isOk: false, message: "Error creating ziya location" });
  }
};

exports.listCategoryProductsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive: isActive },
      },
      {
        $lookup: {
          from: "categories",
          localField: "Category",
          foreignField: "_id",
          as: "categ",
        },
      },
      {
        $unwind: {
          path: "$categ",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          categ: "$categ.Category",
        },
      },

      {
        $match: {
          $or: [
            {
              Category: new RegExp(match, "i"),
            },
            {
              ProductName: new RegExp(match, "i"),
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

    const list = await CategoryProducts.aggregate(query);
    console.log("list in pa", list);
    console.log("list CategoryProducts by  params", list);
    res.json(list);
  } catch (error) {
    console.log("error in list category p", error);
    res.status(400).send("list Category p failed");
  }
};

exports.removeCategoryProducts = async (req, res) => {
  try {
    const del = await CategoryProducts.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete CategoryProducts failed");
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const state = await CategoryProducts.findOne({
      _id: req.params._id,
    }).exec();
    console.log("get CategoryProducts", state);
    res.json(state);
  } catch (error) {
    console.log("error in get category p", error);
    res.status(400).send("get Category p failed");
  }
};

exports.updateCategoryProducts = async (req, res) => {
  try {
    let ProductImage = req.file
      ? `uploads/CategoryProducts/${req.file.filename}`
      : null;
    console.log("pp", ProductImage);
    let fieldvalues = { ...req.body };

    if (ProductImage != null) {
      // Create a temporary file path for the resized image
      const tempResizedImageCP = `uploads/CategoryProducts/tempCP_${req.file.filename}`;

      await sharp(ProductImage)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
          background: "white", // Set background color to white
        })
        .toFile(tempResizedImageCP);

      // Remove the original image
      await fs.unlink(ProductImage);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedImageCP, ProductImage);

      fieldvalues.ProductImage = ProductImage;
    }

    const update = await CategoryProducts.findOneAndUpdate(
      { _id: req.params._id },
      // req.body,
      fieldvalues,

      { new: true }
    );
    console.log("edit ", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update  failed");
  }
};
