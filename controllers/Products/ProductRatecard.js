const ProductRatecard = require("../../models/Products/ProductRatecard");

exports.getProductRatecard = async (req, res) => {
  try {
    const find = await ProductRatecard.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createProductRatecard = async (req, res) => {
  try {
    const add = await new ProductRatecard(req.body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listProductRatecard = async (req, res) => {
  try {
    const list = await ProductRatecard.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveProductRatecard = async (req, res) => {
  try {
    const list = await ProductRatecard.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    if (list) {
      res
        .status(200)
        .json({ isOk: true, data: list, message: "Active Promocode List" });
    } else {
      res.status(400).json({ isOk: false, message: "No Data Found" });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listProductRatecardByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "categorymasters",
          localField: "categoryId",
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
        $lookup: {
          from: "productdetails",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
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
                ProductRatecard: { $regex: match, $options: "i" },
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

    const list = await ProductRatecard.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProductRatecard = async (req, res) => {
  try {
    const update = await ProductRatecard.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeProductRatecard = async (req, res) => {
  try {
    const del = await ProductRatecard.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};
