const { log } = require("console");
const ProductsDetails = require("../../models/Products/ProductsDetails");
const fs = require("fs");
const SubscriptionMaster = require("../../models/Subscription/SubscriptionMaster");
const {  mongoose } = require("mongoose");
exports.getProductsDetails = async (req, res) => {
  try {
    const find = await ProductsDetails.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createProductsDetails = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/Products`)) {
      fs.mkdirSync(`${__basedir}/uploads/Products`);
    }

    let productImage = req.file
      ? `uploads/Products/${req.file.filename}`
      : null;

    let {
      category,
      productName,
      productDescription,
      price,
      weight,
      unit,
      IsGiftHamper,
      IsSubscriptionProduct,
      IsActive,
      isSize,
      isDrink,
      isMilk,
      isOutOfStock,
    } = req.body;

    const add = await new ProductsDetails({
      category,
      productImage,
      productName,
      productDescription,
      price,
      weight,
      unit,
      IsGiftHamper,
      IsSubscriptionProduct,
      IsActive,
      isSize,
      isDrink,
      isMilk,
      isOutOfStock,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listProductsDetails = async (req, res) => {
  try {
    const list = await ProductsDetails.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductByCategory = async (req, res) => {
  try {
    const list = await ProductsDetails.find({
      category: req.params.categoryId,
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();
    if (list) {
      res.status(200).json({ isOk: true, data: list, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.getProductByID = async (req, res) => {
  try {
    const find = await ProductsDetails.findOne({
      _id: req.params.productId,
      IsActive: true,
    }).exec();
    // res.json(find);
    let subData = [];
    if (find) {
      if (find.IsSubscriptionProduct) {
        subData = await SubscriptionMaster.find().exec();
        res.status(200).json({
          isOk: true,
          data: find,
          subcriptionData: subData,
          message: "",
        });
      } else {
        res.status(200).json({
          isOk: true,
          data: find,
          subcriptionData: "No Subscription Details",
          message: "",
        });
      }
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.listProductsDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "categorymasters",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
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
    if (match) {
      query = [
        {
          $match: {
            $or: [
              {
                ProductsDetails: { $regex: match, $options: "i" },
              },
            ],
          },
        },
      ].concat(query);
    }

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

    const list = await ProductsDetails.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProductsDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/Products/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (productImage != null) {
      fieldvalues.productImage = productImage;
    }

    const update = await ProductsDetails.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeProductsDetails = async (req, res) => {
  try {
    const del = await ProductsDetails.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.listProductByCoffee = async (req, res) => {
  try {
    const { option } = req.body;

    const list = await ProductsDetails.find({
      category: "65b8cbd1aa85ec2cb2bf9f5e",
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    let sortedList;

    switch (option) {
      case 1: // Newest
        sortedList = list;
        break;
      case 2: // Price low to high
        sortedList = list.sort((a, b) => a.price - b.price);
        break;
      case 3: // Price high to low
        sortedList = list.sort((a, b) => b.price - a.price);
        break;
      case 4: // A to Z
        sortedList = list.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case 5: // Z to A
        sortedList = list.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      default:
        // Default sorting, perhaps by createdAt descending
        sortedList = list;
    }

    if (sortedList) {
      res.status(200).json({ isOk: true, data: sortedList, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.listProductByTea = async (req, res) => {
  try {
    const list = await ProductsDetails.find({
      category: "65b8cbd9aa85ec2cb2bf9f60",
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    switch (option) {
      case 1: // Newest
        sortedList = list;
        break;
      case 2: // Price low to high
        sortedList = list.sort((a, b) => a.price - b.price);
        break;
      case 3: // Price high to low
        sortedList = list.sort((a, b) => b.price - a.price);
        break;
      case 4: // A to Z
        sortedList = list.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case 5: // Z to A
        sortedList = list.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      default:
        // Default sorting, perhaps by createdAt descending
        sortedList = list;
    }

    if (sortedList) {
      res.status(200).json({ isOk: true, data: sortedList, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductByDrink = async (req, res) => {
  try {
    const list = await ProductsDetails.find({
      category: "65b8e91127d8fef240f3059f",
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    switch (option) {
      case 1: // Newest
        sortedList = list;
        break;
      case 2: // Price low to high
        sortedList = list.sort((a, b) => a.price - b.price);
        break;
      case 3: // Price high to low
        sortedList = list.sort((a, b) => b.price - a.price);
        break;
      case 4: // A to Z
        sortedList = list.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case 5: // Z to A
        sortedList = list.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      default:
        // Default sorting, perhaps by createdAt descending
        sortedList = list;
    }

    if (sortedList) {
      res.status(200).json({ isOk: true, data: sortedList, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductByShop = async (req, res) => {
  //accessories
  try {
    const list = await ProductsDetails.find({
      category: "65c343ea11dfa763253e353f",
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    switch (option) {
      case 1: // Newest
        sortedList = list;
        break;
      case 2: // Price low to high
        sortedList = list.sort((a, b) => a.price - b.price);
        break;
      case 3: // Price high to low
        sortedList = list.sort((a, b) => b.price - a.price);
        break;
      case 4: // A to Z
        sortedList = list.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case 5: // Z to A
        sortedList = list.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      default:
        // Default sorting, perhaps by createdAt descending
        sortedList = list;
    }

    if (sortedList) {
      res.status(200).json({ isOk: true, data: sortedList, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductByFlight = async (req, res) => {
  //gift hampers
  try {
    const list = await ProductsDetails.find({
      category: "65c90fd0da80f9834d4744ca",
      IsActive: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    switch (option) {
      case 1: // Newest
        sortedList = list;
        break;
      case 2: // Price low to high
        sortedList = list.sort((a, b) => a.price - b.price);
        break;
      case 3: // Price high to low
        sortedList = list.sort((a, b) => b.price - a.price);
        break;
      case 4: // A to Z
        sortedList = list.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case 5: // Z to A
        sortedList = list.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      default:
        // Default sorting, perhaps by createdAt descending
        sortedList = list;
    }

    if (sortedList) {
      res.status(200).json({ isOk: true, data: sortedList, message: "" });
    } else {
      res.status(200).json({ isOk: false, message: "No data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
