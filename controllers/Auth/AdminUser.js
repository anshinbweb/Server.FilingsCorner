const AdminUser = require("../../models/Auth/AdminUser");

exports.getAdminUser = async (req, res) => {
  try {
    const find = await AdminUser.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const emailExists = await AdminUser.findOne({
      Email: req.body.Email,
    }).exec();
    if (emailExists) {
      return res.status(200).json({
        isOk: false,
        message: "Email already exists",
      });
    } else {
      const add = await new AdminUser(req.body).save();
      // res.json(add)
      return res.status(200).json({
        isOk: true,
        data: add,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listAdminUser = async (req, res) => {
  try {
    const list = await AdminUser.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listAdminUserByParams = async (req, res) => {
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
              {
                Email: { $regex: match, $options: "i" },
              },
              {
                Password: { $regex: match, $options: "i" },
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

    const list = await AdminUser.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const update = await AdminUser.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeAdminUser = async (req, res) => {
  try {
    const del = await AdminUser.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.userLoginAdmin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const findData = await AdminUser.findOne({
      Email,
      Password,
    }).exec();
    console.log("find", findData);
    if (findData) {
      return res.status(200).json({
        isOk: true,
        data: findData,
        message: "Authentication Successfull",
      });
    } else {
      return res.status(200).json({
        isOk: false,
        message: "Authentication Failed",
      });
      // res.status(200).send("Authentication Failed!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
