const ProductOptions = require("../../../models/Products/Products/ProductOptions");
const ProductVariants = require("../../../models/Products/Products/ProductVariants");
const ProductDetails = require("../../../models/Products/Products/ProductDetails");
const mongoose = require("mongoose");

exports.getProductOptions = async (req, res) => {
  try {
    const find = await ProductOptions.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createProductOptions = async (req, res) => {
  try {
    const add = await new ProductOptions(req.body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listProductOptions = async (req, res) => {
  try {
    const list = await ProductOptions.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveCategories = async (req, res) => {
  try {
    const list = await ProductOptions.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductOptionsByParams = async (req, res) => {
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
                ProductOptions: { $regex: match, $options: "i" },
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

    const list = await ProductOptions.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProductOptions = async (req, res) => {
  try {
    const update = await ProductOptions.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeProductOptions = async (req, res) => {
  try {
    const delTL = await ProductOptions.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.createProductOptionsForvariants = async (req, res) => {
  try {
    productId = req.body.productId;
    parameterId = req.body.parameterId;
    parameterValueId = req.body.parameterValueId;
    IsActive = req.body.IsActive;

    const add = await new ProductOptions({
      productId,
      parameterId,
      parameterValueId,
      IsActive,
    }).save();

    console.log("ProductOptions ", add);

    // add ProductVariants by pnc
    const oldVariants = await ProductVariants.find({
      productId: productId,
    }).exec();

    console.log("oldVariants ", oldVariants);

    let variantsIds = [];
    const productDetail = await ProductDetails.findOne({
      _id: productId,
    }).exec();
    variantsIds = productDetail.productVariantsId;

    if (oldVariants.length == 0) {
      console.log("oldVariants True");
      for (let i = 0; i < parameterValueId.length; i++) {
        const addVariants = await new ProductVariants({
          productId: productId,
          productVariants: parameterValueId[i],
          IsActive: true,
        }).save();
        variantsIds.push(addVariants._id);
      }
    } else {
      // const variants = [];
      // let temp = {};
      // if (parameterValueId.length > 1) {
      //   for (let i = 1; i < parameterValueId.length; i++) {
      //     for (let j = 0; j < find.length; j++) {
      //       // temp = {
      //       //   productId: productId,
      //       //   productVariants: find[j].push(parameterValueId[i]),
      //       // };
      //       // variants.push(temp);
      //       const addVariants = await new ProductVariants({
      //         productId: productId,
      //         productVariants: find[j]['productVariants'].push(parameterValueId[i]),
      //       }).save();
      //     }
      //   }
      // }

      const updateVariants = await ProductVariants.updateMany(
        { productId: productId },
        { $push: { productVariants: parameterValueId[0] } }
      ).exec();

      for (let i = 0; i < oldVariants.length; i++) {
        let data = oldVariants[i].productVariants;
        for (let j = 1; j < parameterValueId.length; j++) {
          data.push(parameterValueId[j]);
          const addVariants = await new ProductVariants({
            productId: productId,
            productVariants: data,
            IsActive: true,
          }).save();
          variantsIds.push(addVariants._id);
          data.pop(parameterValueId[j]);
        }
      }
      console.log("added");

      // const addVariants = await ProductVariants.insertMany(variants);
    }

    console.log("variantsIds", variantsIds);
    console.log("productOptionId", add._id);
    const updateVariantsIds = await ProductDetails.findOneAndUpdate(
      { _id: productId },
      {
        $set: { productVariantsId: variantsIds },
        $push: { productOptionId: add._id },
      },
      { new: true }
    ).exec();
    res.json({ isOk: true, message: "Variants Created" });
  } catch (err) {
    return res.status(400);
  }
};

exports.removeProductOptionsForvariants = async (req, res) => {
  try {
    const productId = req.body.productId;
    const optionId = req.body.optionId;
    let valuesId = req.body.valuesId;

    valuesId = valuesId.map((id) => {
      return new mongoose.Types.ObjectId(id);
    });

    const variantIds = await ProductDetails.findOne({
      _id: productId,
    }).exec();
    let variants = variantIds.productVariantsId;

    const deleteVariants = await ProductVariants.deleteMany({
      _id: { $in: variants },
    }).exec();

    const updateOption = await ProductOptions.updateOne(
      { parameterId: optionId, productId: productId },
      { $set: { parameterValueId: valuesId } },
      { new: true }
    ).exec();

    console.log("updateOption", updateOption);

    const updateProductDetails = await ProductDetails.updateOne(
      {
        _id: productId,
      },
      { $set: { productVariantsId: [] } },
      { new: true }
    ).exec();

    const ProductOption = await ProductOptions.find({
      productId: productId,
    }).exec();

    console.log("ProductOption", ProductOption);

    // call createProductOptionsForvariants recursively to create new variants with some changes on code
    for (let i = 0; i < ProductOption.length; i++) {
      const oldVariants = await ProductVariants.find({
        productId: productId,
      }).exec();

      let variantsIds = [];
      const productDetail = await ProductDetails.findOne({
        _id: productId,
      }).exec();
      variantsIds = productDetail.productVariantsId;

      if (oldVariants.length == 0) {
        console.log("oldVariants True");
        for (let ii = 0; ii < ProductOption[i].parameterValueId.length; ii++) {
          const addVariants = await new ProductVariants({
            productId: productId,
            productVariants: ProductOption[i].parameterValueId[ii],
            IsActive: true,
          }).save();
          variantsIds.push(addVariants._id);
        }
      } else {
        const updateVariants = await ProductVariants.updateMany(
          { productId: productId },
          { $push: { productVariants: ProductOption[i].parameterValueId[0] } }
        ).exec();

        for (let ii = 0; ii < oldVariants.length; ii++) {
          let data = oldVariants[ii].productVariants;
          for (let j = 1; j < ProductOption[i].parameterValueId.length; j++) {
            data.push(ProductOption[i].parameterValueId[j]);
            const addVariants = await new ProductVariants({
              productId: productId,
              productVariants: data,
              IsActive: true,
            }).save();
            variantsIds.push(addVariants._id);
            data.pop(ProductOption[i].parameterValueId[j]);
          }
        }
        console.log("added");
      }

      console.log("variantsIds", variantsIds);
      console.log("productOptionId", ProductOption[i]._id);
      const updateVariantsIds = await ProductDetails.findOneAndUpdate(
        { _id: productId },
        {
          $set: { productVariantsId: variantsIds },
          // $push: { productOptionId: ProductOption[i]._id },
        },
        { new: true }
      ).exec();
    }

    res.json({ isOk: true, message: "Variants Deleted" });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};
