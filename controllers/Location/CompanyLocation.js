const Location = require("../../models/Location/Location");
const fs = require("fs");

exports.listLocation = async (req, res) => {
  try {
    const list = await Location.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.createLocation = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/StoreLogo`)) {
      fs.mkdirSync(`${__basedir}/uploads/StoreLogo`);
    }

    let StoreLogo = req.file ? `uploads/StoreLogo/${req.file.filename}` : null;

    let {
      CityID,
      StateID,
      CountryID,
      Area,
      Address,
      Location,
      UserName,
      Password,
      latitude,
      longitude,
      isActive,
    } = req.body;

    console.log("city", CityID);

    const add = await new Location({
      CityID,
      StateID,
      CountryID,
      StoreLogo,
      Area,
      Address,
      Location,
      UserName,
      Password,
      latitude,
      longitude,
      isActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
    //   }
  } catch (err) {
    res
      .status(400)
      .json({ isOk: false, message: err});
  }
};

exports.listLocationByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive: isActive },
      },
      {
        $lookup: {
          from: "countries",
          localField: "CountryID",
          foreignField: "_id",
          as: "countryname",
        },
      },
      {
        $unwind: {
          path: "$countryname",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          countryname: "$countryname.CountryName",
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "StateID",
          foreignField: "_id",
          as: "statename",
        },
      },
      {
        $unwind: {
          path: "$statename",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          statename: "$statename.StateName",
        },
      },

      {
        $match: {
          $or: [
            {
              Area: new RegExp(match, "i"),
            },
            {
              Address: new RegExp(match, "i"),
            },

            {
              Location: new RegExp(match, "i"),
            },
            {
              countryname: new RegExp(match, "i"),
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

    const list = await Location.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removeLocation = async (req, res) => {
  try {
    const del = await Location.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getLocation = async (req, res) => {
  try {
    const state = await Location.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateLocation = async (req, res) => {
  try {
    let StoreLogo = req.file ? `uploads/StoreLogo/${req.file.filename}` : null;
    console.log("pp", StoreLogo);
    let fieldvalues = { ...req.body };
    if (StoreLogo != null) {
      fieldvalues.StoreLogo = StoreLogo;
    }
    const update = await Location.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.findLocation = async (req, res) => {
  try {
    const find = await Location.find({
      CountryID: req.params.country,
      CityID: req.params.city,
    }).exec();
    res.json(find);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.getPartnerLoginData = async (req, res) => {
  try {
    const { username, password } = req.params;
    const findData = await Location.findOne({
      UserName: username,
    }).exec();
    let UserID = "";
    if (findData !== null) {
      UserID = findData._id;

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
    res.status(400).send(err);
  }
};
