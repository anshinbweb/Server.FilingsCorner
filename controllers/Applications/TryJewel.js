const TryJewel = require("../../models/Applications/TryJewel");

exports.getTryJewel = async (req, res) => {
  try {
    const find = await TryJewel.findOne({ _id: req.params._id }).exec();
    console.log("get Task List", find);
    res.json(find);
  } catch (error) {
    console.log("log error from get TryJewel", error);
    return res.status(400).send("create dynamic content failed from TryJewel");
  }
};

exports.createTryJewel = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log("log error from create TryJewel", err);
    return res.status(400).send("create dynamic content failed from TryJewel");
  }
};

exports.listTryJewel = async (req, res) => {
  try {
    const list = await TryJewel.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log("log error from create TryJewel", error);
    return res.status(400).send("list dynamic content failed from TryJewel");
  }
};

exports.listTryJewelByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match } = req.body;

    let query = [
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
                categoryId: { $regex: match, $options: "i" },
              },
              {
                scaleFactor: { $regex: match, $options: "i" },
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

    const list = await TryJewel.aggregate(query);

    if (list && list.length > 0 && list[0].data && list[0].data.length > 0) {
      console.log(list[0].data);
      //   res.json(list[0].data);
      res.json(list);
    } else {
      res.json({ message: "No data to display." });
    }
  } catch (error) {
    console.log("display error", error);
    // res.send("err in list", error);
    res.status(500).send("Error in fetching data.");
  }
};

exports.removeTryJewel = async (req, res) => {
  try {
    const del = await TryJewel.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete TryJewel failed");
  }
};

exports.updateTryJewel = async (req, res) => {
  try {
    let productImage = req.file
      ? `uploads/TryOnProducts/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    fieldvalues.productImage = productImage;

    const update = await TryJewel.findOneAndUpdate(
      { _id: req.params._id },
    //   req.body,
    fieldvalues,
      { new: true }
    );
    console.log("edit try jewel", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update try jewel failed");
  }
};
