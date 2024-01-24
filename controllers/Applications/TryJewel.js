const TryJewel = require("../../models/Applications/TryJewel");

exports.getTryJewel = async (req, res) => {
  try {
    const find = await TryJewel.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(400).send("create dynamic content failed from TryJewel");
  }
};

exports.getTryJewelByProduct = async (req, res) => {
  try {
    console.log(req.params._id);
    const find = await TryJewel.findOne({ productId: req.params._id, IsActive: true }).exec();
    console.log("get try jewel by product", find);
    res.json(find);
  } catch (error) {
    console.log("log error from get TryJewel", error);
    return res.status(400).send("create dynamic content failed from TryJewel");
  }
};

exports.createTryJewel = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/TryOnProducts/${req.file.filename}`
      : null;

    const { categoryId, productId, scaleFactor, x, y, IsActive } = req.body;

    const add = await new TryJewel({
      categoryId,
      productId,
      scaleFactor,
      productImage,
      x,
      y,
      IsActive,
    }).save();
    res.json(add);
  } catch (err) {
    // console.log("log error from create TryJewel", err);
    return res.status(400).send("create dynamic content failed from TryJewel");
  }
};

exports.listTryJewel = async (req, res) => {
  try {
    const list = await TryJewel.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    // console.log("log error from create TryJewel", error);
    return res.status(400).send("list dynamic content failed from TryJewel");
  }
};

exports.listTryJewelByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { IsActive: isActive },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "cat",
        },
      },
      {
        $unwind: {
          path: "$cat",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          cat: "$cat.Category",
        },
      },
      {
        $lookup: {
          from: "categoryproducts",
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
        $set: {
          product: "$product.ProductName",
        },
      },
      {
        $match: {
          $or: [
            {
              cat: { $regex: match, $options: "i" },
            },
            {
              product: { $regex: match, $options: "i" },
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

    const list = await TryJewel.aggregate(query);

    if (list && list.length > 0 && list[0].data && list[0].data.length > 0) {
      res.json(list);
    } else {
      res.json({ message: "No data to display." });
    }
  } catch (error) {
    res.status(500).send("Error in fetching data.");
  }
};

exports.removeTryJewel = async (req, res) => {
  try {
    const del = await TryJewel.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send("delete TryJewel failed");
  }
};

exports.updateTryJewel = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/TryOnProducts/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    // fieldvalues.productImage = productImage;

    if (productImage != null ) {
      fieldvalues.productImage = productImage;
    }

    const update = await TryJewel.findOneAndUpdate(
      { _id: req.params._id },
    //   req.body,
    fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send("update try jewel failed");
  }
};
