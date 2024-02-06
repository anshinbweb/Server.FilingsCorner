const BannerImages = require("../../models/CMS/BannerImages");
const fs = require("fs");

exports.listBannerImages = async (req, res) => {
  try {
    const list = await BannerImages.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.createBannerImages = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/BannerImg`)) {
      fs.mkdirSync(`${__basedir}/uploads/BannerImg`);
    }

    let bannerimage = req.file
      ? `uploads/BannerImg/${req.file.filename}`
      : null;

    let { Title, Description, IsActive } = req.body;

    const add = await new BannerImages({
      Title,
      Description,
      bannerimage,
      IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ isOk: false, message: err });
  }
};

exports.listBannerImagesByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { IsActive: isActive },
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

    const list = await BannerImages.aggregate(query);
    res.json(list);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.removeBannerImages = async (req, res) => {
  try {
    const del = await BannerImages.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

exports.getBannerImages = async (req, res) => {
  try {
    const state = await BannerImages.findOne({ _id: req.params._id }).exec();
    res.json(state);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateBannerImages = async (req, res) => {
  try {
    let bannerimage = req.file
      ? `uploads/BannerImg/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerimage != null) {
      fieldvalues.bannerimage = bannerimage;
    }
    const update = await BannerImages.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,

      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).send(err);
  }
};
