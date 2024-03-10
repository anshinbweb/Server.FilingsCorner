const ProductsDetails = require("../../../models/Products/Products/ProductDetails");
const fs = require("fs");
const SubscriptionMaster = require("../../../models/Subscription/SubscriptionMaster");
const { mongoose } = require("mongoose");
const ProductOptions = require("../../../models/Products/Products/ProductOptions");
const ProductVariants = require("../../../models/Products/Products/ProductVariants");
const { log } = require("console");

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
      isOutOfStock,
      isSubscription,
      IsActive,
    } = req.body;

    const add = await new ProductsDetails({
      categories: categories ? categories.split(",") : [],
      productName,
      productDescription,
      productImage,
      basePrice,
      weight,
      unit,
      productOptionId: productOptionId ? [productOptionId] : [],
      productVariantsId: productVariantsId ? [productVariantsId] : [],
      isOutOfStock,
      isSubscription,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    // console.log(err);
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

exports.listSubscriptionProducts = async (req, res) => {
  try {
    const listSubsProduct = await ProductsDetails.find({ isSubscription: true })
      .sort({})
      .exec();

    res.json(listSubsProduct);
  } catch (error) {
    return res.status(400).json("error in list subscription products", error);
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
        $unwind: "$categories",
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
          categoryName: {
            $map: {
              input: "$category",
              as: "category2",
              in: "$$category2.categoryName",
            },
          },
        },
      },
    ];
    if (match) {
      query = [
        {
          $match: {
            $or: [
              {
                productName: { $regex: match, $options: "i" },
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

    const list1 = await ProductsDetails.aggregate(query);

    if (list1.length === 0) {
      let ans = [{ count: 0, data: [] }];

      res.json(ans);
    } else {
      let list = [];
      for (let i = 0; i < list1[0].data.length; i++) {
        let obj = {
          _id: list1[0].data[i]._id,
          categories: list1[0].data[i].category.categoryName,
          productName: list1[0].data[i].productName,
          productDescription: list1[0].data[i].productDescription,
          productImage: list1[0].data[i].productImage,
          productVariantsId: list1[0].data[i].productVariantsId,
          basePrice: list1[0].data[i].basePrice,
          weight: list1[0].data[i].weight,
          unit: list1[0].data[i].unit,
          isOutOfStock: list1[0].data[i].isOutOfStock,
          isSubscription: list1[0].data[i].isSubscription,
          IsActive: list1[0].data[i].IsActive,
        };
        list.push(obj);
      }

      let list2 = [];
      for (let i = 0; i < list.length; i++) {
        let obj = {
          _id: list[i]._id,
          categories: [list[i].categories],
          productName: list[i].productName,
          productDescription: list[i].productDescription,
          productImage: list[i].productImage,
          productVariantsId: list[i].productVariantsId,
          basePrice: list[i].basePrice,
          weight: list[i].weight,
          unit: list[i].unit,
          isOutOfStock: list[i].isOutOfStock,
          isSubscription: list[i].isSubscription,
          IsActive: list[i].IsActive,
        };
        for (let j = i + 1; j < list.length; j++) {
          if (String(list[i]._id) == String(list[j]._id)) {
            obj.categories.push(list[j].categories);
            list.splice(j, 1);
          }
        }
        list2.push(obj);
      }

      let ans = [{ count: list1[0].count, data: list2 }];

      res.json(ans);
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send(error);
  }
};

exports.updateProductsDetails = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/Products/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };

    fieldvalues.categories = fieldvalues.categories
      ? fieldvalues.categories.split(",")
      : [];
    fieldvalues.productOptionId = fieldvalues.productOptionId
      ? fieldvalues.productOptionId.split(",")
      : [];
    fieldvalues.productVariantsId = fieldvalues.productVariantsId
      ? fieldvalues.productVariantsId.split(",")
      : [];

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
    res.status(500).send(err);
  }
};

exports.removeProductsDetails = async (req, res) => {
  try {
    const delOptions = await ProductOptions.deleteMany({
      productId: req.params._id,
    });

    const delVariants = await ProductVariants.deleteMany({
      productId: req.params._id,
    });

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

    if (typeof categories === "string") {
      categories = [categories];
    }

    categories = categories.map((id) => new mongoose.Types.ObjectId(id));
    variants = variants.map((id) => new mongoose.Types.ObjectId(id));

    let query = [];
    if (variants.length === 0) {
      query = [
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
          $project: {
            productName: 1,
            productDescription: 1,
            productImage: 1,
            basePrice: 1,
            weight: 1,
            unit: 1,
            isOutOfStock: 1,
            isSubscription: 1,
          },
        },
      ];
    } else {
      query = [
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
              $map: {
                input: "$options",
                as: "option",
                in: "$$option.parameterValueId",
              },
            },
          },
        },
        {
          $unwind: "$parameters",
        },
        {
          $unwind: "$parameters",
        },
        {
          $group: {
            _id: "$_id",
            productName: { $first: "$productName" },
            productDescription: { $first: "$productDescription" },
            productImage: { $first: "$productImage" },
            basePrice: { $first: "$basePrice" },
            weight: { $first: "$weight" },
            unit: { $first: "$unit" },
            isOutOfStock: { $first: "$isOutOfStock" },
            isSubscription: { $first: "$isSubscription" },
            variantIds: { $push: "$parameters" },
          },
        },
        {
          $match: {
            variantIds: { $all: variants }, // Match all the variants provided
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
            parameters: 1,
            variantIds: 1,
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
    }

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
    e.log(error);
    return res.status(400).send(error);
  }
};

exports.getProductsOptions = async (req, res) => {
  try {
    const product = await ProductsDetails.findOne({
      _id: req.params.productId,
    }).exec();

    // const query = [
    //   {
    //     $match: {
    //       _id: { $in: product.productOptionId },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       // $in: ProductOptions.parameterId,
    //       from: "parametermasters",
    //       localField: "parameterId",
    //       foreignField: "_id",
    //       as: "parameter1",
    //     },
    //   },
    //   { $unwind: { path: "$parameter1", preserveNullAndEmptyArrays: true } },

    //   {
    //     $lookup: {
    //       from: "parametervalues",
    //       localField: "parameterValueId",
    //       foreignField: "_id",
    //       as: "parameter",
    //     },
    //   },
    //   // { $unwind: { path: "$parameter", preserveNullAndEmptyArrays: true } },

    //   {
    //     $project: {
    //       parameterName: "$parameter1.parameterName",
    //       paramterid: "$parameter1._id",
    //       // parameterValue: "$parameterValue.parameterValue",
    //       parameterValueId: 1,
    //       parameterValueNames: {
    //         $map: {
    //           input: "$parameter",
    //           as: "parameter2",
    //           in: "$$parameter2._id",
    //         },
    //       },
    //     },
    //   },
    // ];

    // const options = await ProductOptions.aggregate(query).exec();
    // // console.log(options);

    // let newOptions = [];
    // options.forEach((element) => {
    //   let newOption = {
    //     id: element.paramterid,
    //     name: element.parameterName,
    //     // make a object of parameterValueId and parameterValueNames
    //     parameterValues: element.parameterValueNames.map((value, index) => {
    //       console.log("value in backend", value);
    //       console.log("value in backend ", element.parameterValueId);
    //       return {
    //         id: element.parameterValueId[index],
    //         name: value,
    //       };
    //     }),
    //   };
    //   newOptions.push(newOption);
    // });

    const query = [
      {
        $match: {
          _id: { $in: product.productOptionId },
        },
      },
      {
        $lookup: {
          from: "parametermasters",
          localField: "parameterId",
          foreignField: "_id",
          as: "parameter",
        },
      },
      { $unwind: "$parameter" },
      {
        $lookup: {
          from: "parametervalues",
          localField: "parameterValueId",
          foreignField: "_id",
          as: "parameterValues",
        },
      },
      {
        $project: {
          id: "$parameter._id",
          name: "$parameter.parameterName",
          parameterValues: {
            $map: {
              input: "$parameterValues",
              as: "value",
              in: {
                id: "$$value._id",
                name: "$$value.parameterValue",
              },
            },
          },
        },
      },
    ];

    const options = await ProductOptions.aggregate(query).exec();

    res.json(options);
  } catch (error) {
    // console.log(error);
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
    // console.log(error);
    return res.status(400).send(error);
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await ProductsDetails.findOne({
      _id: productId,
    }).exec();

    console.log("product", product);

    const query = [
      {
        $match: {
          categories: { $in: product.categories },
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

    const relatedProducts = await ProductsDetails.aggregate(query).exec();

    for (let i = relatedProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [relatedProducts[i], relatedProducts[j]] = [
        relatedProducts[j],
        relatedProducts[i],
      ];
    }
    const limitedRelatedProducts = relatedProducts.slice(0, 5);

    res.json(limitedRelatedProducts);
  } catch (error) {
    // console.log(error);
    return res.status(500).send(error);
  }
};
