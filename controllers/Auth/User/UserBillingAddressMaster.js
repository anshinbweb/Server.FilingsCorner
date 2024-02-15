const UserBillingAddress = require("../../../models/Auth/User/UserBillingAddressMaster");

exports.getUserBillingAddress = async (req, res) => {
  try {
    const find = await UserBillingAddress.findOne({
      _id: req.params._id,
    }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createUserBillingAddress = async (req, res) => {
  try {
    const add = await new UserBillingAddress(req.body).save();
    res.json(add);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listUserBillingAddress = async (req, res) => {
  try {
    const list = await UserBillingAddress.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listUserBillingAddressByParams = async (req, res) => {
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
                firstName: { $regex: match, $options: "i" },
              },
              {
                lastName: { $regex: match, $options: "i" },
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

    const list = await UserBillingAddress.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUserBillingAddress = async (req, res) => {
  try {
    const update = await UserBillingAddress.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeUserBillingAddress = async (req, res) => {
  try {
    const del = await UserBillingAddress.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};
