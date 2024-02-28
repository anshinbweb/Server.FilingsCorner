const ProductsDetails = require("../../../models/Products/Products/ProductDetails");
const fs = require("fs");
const SubscriptionMaster = require("../../../models/Subscription/SubscriptionMaster");
const { mongoose } = require("mongoose");
const ProductOptions = require("../../../models/Products/Products/ProductOptions");

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
      categories,
      productName,
      productDescription,
      basePrice,
      weight,
      unit,
      productOptionId,
      productVariantsId,
      IsActive,
    } = req.body;

    const add = await new ProductsDetails({
      categories,
      productName,
      productDescription,
      basePrice,
      weight,
      unit,
      productOptionId,
      productVariantsId,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listProductsDetails = async (req, res) => {
  try {
    const list = await ProductsDetails.find().sort({ productName: 1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductByCategory = async (req, res) => {
  try {
    const list = await ProductsDetails.find({
      categories: { $in: [req.params.categoryId] },
      // categories: req.params.categoryId,
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

exports.getProductByID_ = async (req, res) => {
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

exports.getProductByID = async (req, res) => {
  try {
    let query = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.productId),
          IsActive: true,
        },
      },
      {
        $lookup: {
          from: "categorymasters",
          localField: "categories",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          productName: 1,
          productDescription: 1,
          productImage: 1,
          basePrice: 1,
          weight: 1,
          unit: 1,
          isOutOfStock: 1,
          isSubscription: 1,

          category: {
            $map: {
              input: "$category",
              as: "cat",
              in: {
                _id: "$$cat._id",
                categoryName: "$$cat.categoryName",
              },
            },
          },
        },
      },
    ];

    const find = await ProductsDetails.aggregate(query).exec();

    if (find.length > 0) {
      res.status(200).json({ isOk: true, data: find[0], message: "" });
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

exports.CategoryProductListData = async (req, res) => {
  try {
    // const { option, categoryId } = req.params;
    const option = req.body.option;
    let categories = req.body.categories;
    let variants = req.body.variants;

    categories = categories.map((id) => new mongoose.Types.ObjectId(id));
    variants = variants.map((id) => new mongoose.Types.ObjectId(id));

    let query = [
      {
        $match: {
          IsActive: true,
          categories: { $in: categories },
        },
      },
      {
        $lookup: {
          from: "productoptions",
          localField: "productOptionId",
          foreignField: "_id",
          as: "options",
        },
      },
      {
        $set: {
          parameters: {
            // make a array of all parameterValueId as a single array
            $map: {
              input: "$options",
              as: "option",
              in: "$$option.parameterValueId",
              // in: {
              //   $reduce: {
              //     input: "$$option.parameterValueId",
              //     initialValue: "",
              //     in: {
              //       $concat: ["$$value", { $toString: "$$this" }],
              //     },
              //   },
              // },
            },
          },
        },
      },
      {
        $match: {
          parameters: { $all: variants }, // Match all the variants provided
        },
      },
      {
        $project: {
          productName: 1,
          productDescription: 1,
          productImage: 1,
          basePrice: 1,
          weight: 1,
          unit: 1,
          isOutOfStock: 1,
          isSubscription: 1,
          // parameters: 1,
          // options: {
          //   $map: {
          //     input: "$options",
          //     as: "option",
          //     in: {
          //       _id: "$$option._id",
          //       parameterId: "$$option.parameterId",
          //       parameterValueId: "$$option.parameterValueId",
          //     },
          //   },
          // },
        },
      },
    ];

    const list = await ProductsDetails.aggregate(query)
      .sort({ createdAt: -1 })
      .exec();

    let sortedList;

    switch (option) {
      case "1": // Newest
        sortedList = list;
        break;
      case "2": // Price low to high
        sortedList = list.sort((a, b) => a.price - b.price);
        break;
      case "3": // Price high to low
        sortedList = list.sort((a, b) => b.price - a.price);

        break;
      case "4": // A to Z
        sortedList = list.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "5": // Z to A
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

exports.getProductsOptions = async (req, res) => {
  try {
    const product = await ProductsDetails.findOne({
      _id: req.params.productId,
    }).exec();

    const query = [
      {
        $match: {
          _id: { $in: product.productOptionId },
        },
      },
      {
        $lookup: {
          // $in: ProductOptions.parameterId,
          from: "parametermasters",
          localField: "parameterId",
          foreignField: "_id",
          as: "parameter1",
        },
      },
      { $unwind: { path: "$parameter1", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "parametervalues",
          localField: "parameterValueId",
          foreignField: "_id",
          as: "parameter",
        },
      },
      // { $unwind: { path: "$parameter", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          parameterName: "$parameter1.parameterName",
          // parameterValue: "$parameterValue.parameterValue",
          parameterValueId: 1,
          parameterValueNames: {
            $map: {
              input: "$parameter",
              as: "parameter2",
              in: "$$parameter2.parameterValue",
            },
          },
        },
      },
    ];

    const options = await ProductOptions.aggregate(query).exec();
    // console.log(options);

    let newOptions = [];
    options.forEach((element) => {
      let newOption = {
        id: element._id,
        name: element.parameterName,
        // make a object of parameterValueId and parameterValueNames
        parameterValues: element.parameterValueNames.map((value, index) => {
          return {
            id: element.parameterValueId[index],
            name: value,
          };
        }),
      };
      newOptions.push(newOption);
    });

    res.json(newOptions);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.getProductsOptionsParameters = async (req, res) => {
  try {
    const { productId, optionId } = req.params;

    const query = [
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
          parameterId: new mongoose.Types.ObjectId(optionId),
        },
      },
      {
        $lookup: {
          from: "parametervalues",
          localField: "parameterValueId",
          foreignField: "_id",
          as: "parameter",
        },
      },

      {
        $project: {
          // parameterValue: 1,
          parameterValueId: 1,
          parameterNames: {
            $map: {
              input: "$parameter",
              as: "parameter",
              in: "$$parameter.parameterValue",
            },
          },
        },
      },
      { $unwind: { path: "$parameter", preserveNullAndEmptyArrays: true } },
    ];

    const options = await ProductOptions.aggregate(query).exec();

    res.json(options);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
