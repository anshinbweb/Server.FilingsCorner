const PartnerLogin = require("../../models/PartnerLogin/PartnerLogin");
const fs = require("fs");

exports.listPartner = async (req, res) => {
  try {
    const list = await PartnerLogin.find().sort({ createdAt: -1 }).exec();
    // console.log("list country", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list ziya PartnerLogin failed");
  }
};

exports.createPartner = async (req, res) => {
  try {
    let { ContactName, UserName, Password, IsActive } = req.body;

    const add = await new PartnerLogin({
      ContactName,
      UserName,
      Password,
      IsActive,
    }).save();
    console.log("create PartnerLogin", add);
    res.status(200).json({ isOk: true, data: add, message: "" });
    //   }
  } catch (err) {
    console.log("error in create", err);
    res
      .status(400)
      .json({ isOk: false, message: "Error creating PartnerLogin" });
  }
};

exports.listPartnerByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },

      {
        $match: {
          $or: [
            {
              ContactName: new RegExp(match, "i"),
            },
            {
              UserName: new RegExp(match, "i"),
            },

            {
              Password: new RegExp(match, "i"),
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

    const list = await PartnerLogin.aggregate(query);
    console.log("list Partner by  params", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list all ziya location failed");
  }
};

exports.removePartner = async (req, res) => {
  try {
    const del = await PartnerLogin.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete Partner failed");
  }
};

exports.getPartner = async (req, res) => {
  try {
    const state = await PartnerLogin.findOne({ _id: req.params._id }).exec();
    console.log("get PartnerLogin", state);
    res.json(state);
  } catch (error) {
    console.log(error);
    res.status(400).send("get PartnerLogin failed");
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const update = await PartnerLogin.findOneAndUpdate(
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

exports.getPartnerLoginDetails = async (req, res) => {
  try {
    const { username, password } = req.params;
    const findData = await PartnerLogin.findOne({
      UserName: username,
    }).exec();
    console.log("find", findData);
    let UserID = "";
    if (findData !== null) {
      UserID = findData._id;

      console.log("inside", UserID);
      return res.status(200).json({
        isOk: true,
        data: UserID,
        message: "Authentication Successfull",
      });
    } else {
      // console.log("error in getting", UserID);
      if (!findData) {
        return res.status(200).json({
          isOk: false,
          field: 2,
          message: "Username does not match",
        });
      } else if (findData.Password !== password) {
        return res.status(200).json({
          isOk: false,
          field: 1,
          message: "Password does not matches",
        });
      }
    }
  } catch (err) {
    res.status(400).send("error in get user");
  }
};
