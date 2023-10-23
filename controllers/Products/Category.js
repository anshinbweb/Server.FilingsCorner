const Category = require("../../models/Products/Category");

exports.listCategory = async (req, res) => {
  const list = await Category.find().sort({ createdAt: -1 }).exec();
  // console.log("list country", list);
  res.json(list);
};

exports.createCategory = async (req, res) => {
  try {
    // if (!fs.existsSync(`${__basedir}/uploads/Category`)) {
    //     fs.mkdirSync(`${__basedir}/uploads/Category`);
    //   }

    console.log("create", req.body);
  
    //   let CategoryImage = req.files.CategoryImage;
  
      let CategoryImage = req.file
        ? `uploads/Category/${req.file.filename}`
        : null;

        console.log(CategoryImage)
  
      let {  Description, isActive } = req.body;
  
      const add = await new Category({
        Category: req.body.Category,
        // CategoryImage: `uploads/Category/${CategoryImage.filename}`,
        CategoryImage: CategoryImage,
        Description,
        isActive,
      }).save();
      res.json(add);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ isOk: false, message: err });
  }
};

exports.listCategoryByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

  let query = [
    {
      $match: { isActive: IsActive },
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
        console.log("update",req.body);
        let CategoryImage =
        req.files || req.body.CategoryImage
          ? req.body.CategoryImage
            ? req.body.CategoryImage
            : `uploads/Category/${req.file.filename}`
          : null;
  
      let fieldvalues = { ...req.body };
      if (CategoryImage != null ) {
        fieldvalues.CategoryImage = CategoryImage;
      }
  
      const update = await Category.findOneAndUpdate(
        { _id: req.params._id },
        fieldvalues,
        { new: true }
      );
      console.log(update);
      res.json(update);
    } catch (err) {
      console.log(err);
      res.status(400).send("update  failed");
    }
};

