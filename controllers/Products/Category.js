const Category = require("../Products/Category");

exports.listCategory = async (req, res) => {
  const list = await Category.find().sort({ createdAt: -1 }).exec();
  // console.log("list country", list);
  res.json(list);
};

exports.createCategory = async (req, res) => {
  try {
    const add = await new Category(req.body).save();
    // console.log("create country", addCountry);
    res.status(200).json({ isOk: true, data: add, message: "" });
    //   }
  } catch (err) {
    res
      .status(200)
      .json({ isOk: false, message: "Error creating category" });
  }
};

exports.listCategoryByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

  let query = [
    {
      $match: { isActive: isActive },
    },
    {
      $match: {
        $or: [
          {
            Category: new RegExp(match, "i"),
          },
          {
            Description: new RegExp(match, "i"),
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

  const list = await Category.aggregate(query);
  console.log("list Category by  params", list);
  res.json(list);
};

exports.removeCategory = async (req, res) => {
  try {
    const del = await Category.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete Category failed");
  }
};

exports.getCategory = async (req, res) => {
  const state = await Category.findOne({ _id: req.params._id }).exec();
  console.log("get Category", state);
  res.json(state);
};

exports.updateCategory = async (req, res) => {
    try {
      const update = await Category.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true }
      );
      console.log("edit ", update);
      res.json(update);
    } catch (err) {
      console.log(err);
      res.status(400).send("update  failed");
    }
};

