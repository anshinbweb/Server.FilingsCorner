const ZiyaLocation = require("../models/ZiyaLocation");

exports.listZiyaLocation = async (req, res) => {
  const list = await ZiyaLocation.find().sort({ createdAt: -1 }).exec();
  // console.log("list country", list);
  res.json(list);
};

exports.createZiyaLocation = async (req, res) => {
  try {
    //   const code = await ZiyaLocation.findOne({ CountryCode: req.body.CountryCode });
    //   const country = await Country.findOne({
    //     CountryName: req.body.CountryName,
    //   });
    //   if (country) {
    //     return res
    //       .status(200)
    //       .json({
    //         isOk: false,
    //         field: 1,
    //         message: "Country with this name already exists!",
    //       });
    //   } else if (code) {
    //     return res
    //       .status(200)
    //       .json({
    //         isOk: false,
    //         field: 2,
    //         message: "Country with this code already exists!",
    //       });
    //   } else {
    // const { CountryName, CountryCode } = req.body;
    const add = await new ZiyaLocation(req.body).save();
    // console.log("create country", addCountry);
    res.status(200).json({ isOk: true, data: add, message: "" });
    //   }
  } catch (err) {
    res
      .status(200)
      .json({ isOk: false, message: "Error creating ziya location" });
  }
};

exports.listZiyaLocationByParams = async (req, res) => {
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
            Location: new RegExp(match, "i"),
          },
        //   {
        //     countryname: new RegExp(match, "i"),
        //   },
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
  const state = await ZiyaLocation.findOne({ _id: req.params._id }).exec();
  console.log("get ZiyaLocation", state);
  res.json(state);
};

exports.updateZiyaLocation = async (req, res) => {
    try {
      // const { CountryCode, CountryName } = req.body;
      const update = await ZiyaLocation.findOneAndUpdate(
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
