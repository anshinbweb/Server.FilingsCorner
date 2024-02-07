const ProductsDetails = require("../../models/Products/ProductsDetails");
const fs = require("fs");

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
  
      let productImage = req.file ? `uploads/Products/${req.file.filename}` : null;
  
      let {
        category,
        productName,
        productDescription,
        price,
        IsGiftHamper,
        IsSubscriptionProduct,
        IsActive,
      } = req.body;
  
  
      const add = await new ProductsDetails({
        category,
        productImage,
        productName,
        productDescription,
        price,
        IsGiftHamper,
        IsSubscriptionProduct,
        IsActive,
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}

exports.listProductsDetails = async (req, res) => {
  try {
    const list = await ProductsDetails.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
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

    let productImage = req.file ? `uploads/Products/${req.file.filename}` : null;
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
    const del= await ProductsDetails.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};
