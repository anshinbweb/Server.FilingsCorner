const ZiyaLocation = require("../models/ZiyaLocation");
const fs = require("fs");

exports.listZiyaLocation = async (req, res) => {
  try {
    const list = await ZiyaLocation.find().sort({ createdAt: -1 }).exec();
    // console.log("list country", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list ziya location failed");
  }
};

exports.createZiyaLocation = async (req, res) => {
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
      latitude,
      longitude,
      isActive,
    } = req.body;

    console.log("city", CityID);

    const add = await new ZiyaLocation({
      CityID,
      StateID,
      CountryID,
      StoreLogo,
      Area,
      Address,
      Location,
      latitude,
      longitude,
      isActive,
    }).save();
    console.log("create location", add);
    res.status(200).json({ isOk: true, data: add, message: "" });
    //   }
  } catch (err) {
    console.log("error in create", err);
    res
      .status(400)
      .json({ isOk: false, message: "Error creating ziya location" });
  }
};

exports.listZiyaLocationByParams = async (req, res) => {
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
      // {
      //     $lookup: {
      //       from: "cities",
      //       localField: "CityID",
      //       foreignField: "_id",
      //       as: "city",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$city",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $set: {
      //         CityName: "$city.CityName",
      //     },
      //   },
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
            //   {
            //     statename: new RegExp(match, "i"),
            //   },
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

    const list = await ZiyaLocation.aggregate(query);
    console.log("list ZiyaLocation by  params", list);
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send("list all ziya location failed");
  }
};

exports.removeZiyaLocation = async (req, res) => {
  try {
    const del = await ZiyaLocation.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete ZiyaLocation failed");
  }
};

exports.getZiyaLocation = async (req, res) => {
  try {
    const state = await ZiyaLocation.findOne({ _id: req.params._id }).exec();
    console.log("get ZiyaLocation", state);
    res.json(state);
  } catch (error) {
    console.log(error);
    res.status(400).send("get ZiyaLocation failed");
  }
};

exports.updateZiyaLocation = async (req, res) => {
  try {
    // const { CountryCode, CountryName } = req.body;
    let StoreLogo = req.file ? `uploads/StoreLogo/${req.file.filename}` : null;
    console.log("pp", StoreLogo);
    let fieldvalues = { ...req.body };
    // fieldvalues.ProductPicture = null;
    if (StoreLogo != null) {
      fieldvalues.StoreLogo = StoreLogo;
    }
    const update = await ZiyaLocation.findOneAndUpdate(
      { _id: req.params._id },
      // req.body,
      fieldvalues,

      { new: true }
    );
    console.log("edit ", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update  failed");
  }
};

exports.findZiyaLocation = async (req, res) => {
  try {
    const find = await ZiyaLocation.find({
      CountryID: req.params.country,
      CityID: req.params.city,
    }).exec();
    console.log("get ZiyaLocation", find);
    res.json(find);
  } catch (error) {
    console.log(error);
    res.status(400).send("find ziya failed");
  }
};
