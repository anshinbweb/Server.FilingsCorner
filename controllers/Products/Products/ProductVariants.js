const ProductVariants = require("../../../models/Products/Products/ProductVariants");
const mongoose = require("mongoose");
const { param } = require("../../../routes/UserCart");

exports.getProductVariants = async (req, res) => {
  try {
    const find = await ProductVariants.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createProductVariants = async (req, res) => {
  try {
    const add = await new ProductVariants(req.body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listProductVariants = async (req, res) => {
  try {
    const list = await ProductVariants.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductVariantsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
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
                ProductVariants: { $regex: match, $options: "i" },
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

    const list = await ProductVariants.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProductVariants = async (req, res) => {
  try {
    const update = await ProductVariants.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeProductVariants = async (req, res) => {
  try {
    const delTL = await ProductVariants.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getProductVariantsInfo = async (req, res) => {
  try {
    const productId = req.body.productId;
    const productVariantObject = req.body.productVariants;

    let productVariant = [];
    for (let key in productVariantObject) {
      productVariant.push(productVariantObject[key]);
    }

    const find = await ProductVariants.findOne({
      productId: productId,
      productVariants: { $all: productVariant },
    }).exec();
    res.json(find);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.listProductVariantsByProductId = async (req, res) => {
  try {
    const find = await ProductVariants.find({
      productId: req.params._id,
    })
      .populate("productVariants")
      .exec();
    res.json(find);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateProductVariantPrice = async (req, res) => {
  try {
    const { value } = req.body;
    const update = await ProductVariants.findOneAndUpdate(
      { _id: req.params._id },
      { priceVariant: value },
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateProductVariantSubs = async (req, res) => {
  try {
    const { value } = req.body;
    const update = await ProductVariants.findOneAndUpdate(
      { _id: req.params._id },
      { isSubscription: value },
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateProductVariantStock = async (req, res) => {
  try {
    const { value } = req.body;
    const update = await ProductVariants.findOneAndUpdate(
      { _id: req.params._id },
      { isOutOfStock: value },
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateProductVariantActive = async (req, res) => {
  try {
    const { value } = req.body;
    const update = await ProductVariants.findOneAndUpdate(
      { _id: req.params._id },
      { IsActive: value },
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getProductVariantsInfoInCart = async (req, res) => {
  try {
    const productVariantsId = req.params.productVariantsId;

    let query = [
      {
        $match: { _id: new mongoose.Types.ObjectId(productVariantsId) },
      },
      {
        $lookup: {
          from: "parametervalues",
          localField: "productVariants",
          foreignField: "_id",
          as: "parametervalues",
        },
      },
      {
        $unwind: {
          path: "$parametervalues",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $set: {
          parametervalues: "$parametervalues.parameterValue",
          parametervaluesId: "$parametervalues.parameterId",
        },
      },

      {
        $lookup: {
          from: "parametermasters",
          localField: "parametervaluesId",
          foreignField: "_id",
          as: "parametermaster",
        },
      },
      {
        $unwind: {
          path: "$parametermaster",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          parameterName: "$parametermaster.parameterName",
        },
      },

      {
        $set: {
          parameter: {
            parameterName: "$parameterName",
            parameterValue: "$parametervalues",
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          productVariants: { $first: "$productVariants" },
          parameters: { $push: "$parameter" },
          priceVariant: { $first: "$priceVariant" },
          isSubscription: { $first: "$isSubscription" },
          isOutOfStock: { $first: "$isOutOfStock" },
          IsActive: { $first: "$IsActive" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },

      {
        $project: {
          _id: 1,
          productVariants: 1,
          parameters: 1,
          priceVariant: 1,
          isSubscription: 1,
          isOutOfStock: 1,
          IsActive: 1,
        },
      },
    ];

    const find = await ProductVariants.aggregate(query).exec();

    res.json(find);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
