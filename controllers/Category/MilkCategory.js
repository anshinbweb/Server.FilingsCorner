const MilkCategory = require("../../models/Category/MilkCategory");

exports.getMilkCategory = async (req, res) => {
  try {
    const find = await MilkCategory.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createMilkCategory = async (req, res) => {
  try {
    const add = await new MilkCategory(req.body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listMilkCategory = async (req, res) => {
  try {
    const list = await MilkCategory.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveMilkCategories = async (req, res) => {
  try {
    const list = await MilkCategory.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listMilkCategoryByParams = async (req, res) => {
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
                MilkCategory: { $regex: match, $options: "i" },
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

    const list = await MilkCategory.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateMilkCategory = async (req, res) => {
  try {
    const update = await MilkCategory.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeMilkCategory = async (req, res) => {
  try {
    const delTL = await MilkCategory.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
