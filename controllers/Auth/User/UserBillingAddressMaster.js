const UserBillingAddress = require("../../../models/Auth/User/UserBillingAddressMaster");
const User = require("../../../models/Auth/User/Users");
exports.getUserBillingAddress = async (req, res) => {
  try {
    const find = await UserBillingAddress.findOne({
      _id: req.params._id,
    }).exec();

    res.json(find);
  } catch (error) {
    return res.status(500).json("error in get", error);
  }
};

exports.createUserBillingAddress = async (req, res) => {
  try {
    const add = await new UserBillingAddress(req.body).save();
    const billingID = add._id;
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { billingAddress: billingID } },
      { new: true }
    );

    res.json(add);
  } catch (err) {
    console.log(err);
    res.status(500).json("error in create", err);
  }
};

//APP
exports.AddUpdateBillingAddress = async (req, res) => {
  try {
    const id = req.body.id;
    const findData = await UserBillingAddress.findOne({ _id: id }).exec();
    if (findData) {
      const update = await UserBillingAddress.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true }
      );
      res.json(update);
    } else {
      const add = await new UserBillingAddress(req.body).save();
      res.json(add);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("error in data", err);
  }
};

exports.listUserBillingAddress = async (req, res) => {
  try {
    const list = await UserBillingAddress.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    res.status(500).json("error in list user", error);
  }
};

exports.listActiveBillingAddress = async (req, res) => {
  try {
    const list = await UserBillingAddress.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).json("error in list active billing address", error);
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
    res.status(500).json("error in list", error);
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
    res.status(500).json("error in update", err);
  }
};

exports.removeUserBillingAddress = async (req, res) => {
  try {
    // Remove billing address
    const BillingAdd = await UserBillingAddress.findOne({
      _id: req.params._id,
    });

    if (BillingAdd) {
      const updatedUserBA = await User.findOneAndUpdate(
        { _id: BillingAdd.userId },
        { $pull: { billingAddress: req.params._id } },
        { new: true }
      );
      const deletedBA = await UserBillingAddress.findOneAndRemove({
        _id: req.params._id,
      });
      console.log("delted", deletedBA);
      res.json(deletedBA);
    } else {
      console.log("Billing address not found");
    }
  } catch (error) {
    res.status(500).json("error in remove", error);
  }
};
