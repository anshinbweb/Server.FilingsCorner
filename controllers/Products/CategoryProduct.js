const { log } = require("console");
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
    console.log("files", req.files);
    // let ProductImage = req.file
    //   ? `uploads/CategoryProducts/${req.file.filename}`
    //   : null;

    let ProductImage = req.files.ProductImage[0];
    // let ProductHoverImage = req.files.ProductHoverImage[0];
    let ProductHoverImage =
      req.body.ProductHoverImage === "" ? null : req.files.ProductHoverImage[0];

    // let ProductHoverImage = req.file
    // ? `uploads/CategoryProducts/${req.file.filename}`
    // : null;

    if (ProductImage) {
      // const tempResizedImageCP = `uploads/CategoryProducts/tempCP_${req.file.filename}`;
      const tempResizedImageCP = `uploads/CategoryProducts/tempCP_${ProductImage.filename}`;
      const PATH = ProductImage.path;
      console.log("eeee");
      await sharp(PATH)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
          background: "white",
        })
        .toFile(tempResizedImageCP);
      console.log("www");

      await fs.unlink(PATH);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedImageCP, PATH);
    }

    if (ProductHoverImage) {
      const tempResizedHoverImageCP = `uploads/CategoryProducts/tempCP_${ProductHoverImage.filename}`;
      const HoverPATH = ProductHoverImage.path;

      await sharp(HoverPATH)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
          background: "white",
        })
        .toFile(tempResizedHoverImageCP);

      await fs.unlink(HoverPATH);
      await fs.rename(tempResizedHoverImageCP, HoverPATH);
    }

    let {
      Category,
      ProductName,
      ProductWeight,
      ProductDescription,
      MetalDetails,
      isActive,
      IsTopProduct,
    } = req.body;

    const newMetalDetails = JSON.parse(MetalDetails);
    const extractedObjects = [];

    newMetalDetails.forEach((nestedArray) => {
      if (nestedArray && nestedArray.length > 0) {
        const extractedObject = nestedArray[0]; // Assuming there's only one object in each nested array
        extractedObjects.push(extractedObject);
      }
    });
    console.log("newCoordinates", newMetalDetails);
    console.log("extractedObjects", extractedObjects);

    const add = await new CategoryProducts({
      Category: Category,
      ProductName: ProductName,
      ProductWeight: ProductWeight,
      ProductDescription: ProductDescription,
      MetalDetails: extractedObjects,
      isActive: isActive,
      ProductImage: ProductImage.path,
      ProductHoverImage:
        ProductHoverImage === null ? null : ProductHoverImage.path,
      IsTopProduct: IsTopProduct,
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

exports.listAllTrendingProducts = async (req, res) => {
  try {
    let {
      skip,
      per_page,
      sorton,
      sortdir,
      match,
      // isActive,
      checktopProd,
    } = req.body;

    console.log("req.body", req.body);

    let query = [
      {
        $match: {
          $or: [
            // { isActive: isActive },
            { IsTopProduct: checktopProd },
          ],
        },
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

    const listTP = await CategoryProducts.aggregate(query);
    console.log("list in pa", listTP);
    res.json(listTP);
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
    // let ProductImage = req.file
    //   ? `uploads/CategoryProducts/${req.file.filename}`
    //   : null;

    // let profileMp = req.file ? `profile-sh/${req.file.filename}` : null;
    console.log("req", req.body);
    log("req", req.files);
    let ProductImage =
      req.files || req.body.ProductImage
        ? req.body.ProductImage
          ? req.body.ProductImage
          : `uploads/CategoryProducts/${req.files.ProductImage[0].filename}`
        : null;

    let ProductHoverImage =
      req.files || req.body.ProductHoverImage
        ? req.body.ProductHoverImage
          ? req.body.ProductHoverImage
          : `uploads/CategoryProducts/${req.files.ProductHoverImage[0].filename}`
        : null;

    console.log("pp", ProductImage);
    console.log("piii", ProductHoverImage);

    let fieldvalues = { ...req.body };

    if (req.files && req.files.ProductImage) {
      // Create a temporary file path for the resized image
      const tempResizedImageCP = `uploads/CategoryProducts/tempCP_${req.files.ProductImage[0].filename}`;
      // const PATH = ProductImage.path;

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

    if (req.files && req.files.ProductHoverImage) {
      // Create a temporary file path for the resized image
      log("ProductHoverImage", ProductHoverImage);
      const uploadedFile = req.files.ProductHoverImage[0];

      const tempResizedHoverImageCP = `uploads/CategoryProducts/tempCP_${req.files.ProductHoverImage[0].filename}`;
      // const HoverPATH = ProductHoverImage.path;

      await sharp(uploadedFile.path)
        .resize({
          width: 400,
          height: 400,
          fit: "contain",
          background: "white", // Set background color to white
        })
        .toFile(tempResizedHoverImageCP);

      // Remove the original image
      await fs.unlink(uploadedFile.path);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedHoverImageCP, uploadedFile.path);

      fieldvalues.ProductHoverImage = uploadedFile.path;
    }

    const newMetalDetails = JSON.parse(fieldvalues.MetalDetails);
    const extractedObjects = [];
    newMetalDetails.forEach((nestedArray) => {
      if (nestedArray && nestedArray.length > 0) {
        const extractedObject = nestedArray[0]; // Assuming there's only one object in each nested array
        extractedObjects.push(extractedObject);
      }
    });
    fieldvalues["MetalDetails"] = extractedObjects;

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

exports.FilterProductByWeight = async (req, res) => {
  // const { minWeight, maxWeight } = req.query;
  const { minWeight, maxWeight } = req.params;

  try {
    const products = await CategoryProducts.find({
      ProductWeight: { $gte: minWeight, $lte: maxWeight },
    });

    console.log("product list", products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
