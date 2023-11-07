const ManageMedia = require("../../models/Media/ManageMedia");
const sharp = require("sharp"); // Import the sharp library
const fs = require("fs").promises; // Import the 'fs.promises' module

exports.listManageMedia = async (req, res) => {
  try{
    const list = await ManageMedia.find()
    // .sort({ createdAt: -1 })
    .exec();

    console.log("list media", list)
  res.json(list);
  }catch(err){
    console.log(err);
  }
};

exports.createManageMedia = async (req, res) => {
  try {
    // if (!fs.existsSync(`${__basedir}/uploads/ManageMedia`)) {
    //     fs.mkdirSync(`${__basedir}/uploads/ManageMedia`);
    //   }

    // console.log("create", req.body);

    //   let ManageMediaImage = req.files.ManageMediaImage;

    let Media = req.file
      ? `uploads/ManageMedia/${req.file.filename}`
      : null;


    let {MediaName, Description, isActive } = req.body;

    const add = await new ManageMedia({
      MediaName,
      Media,
      Description,
      isActive,
    }).save();
    res.json(add);
  } catch (err) {
    console.log(err);
    res.status(400).json({ isOk: false, message: err });
  }
};

exports.listManageMediaByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

  let query = [
    {
      $match: { isActive: IsActive },
    },
    {
      $match: {
        $or: [
          {
            MediaName: new RegExp(match, "i"),
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

  const list = await ManageMedia.aggregate(query);
  console.log("list ManageMedia by  params", list);
  res.json(list);
};

exports.removeManageMedia = async (req, res) => {
  try {
    const del = await ManageMedia.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete ManageMedia failed");
  }
};

exports.getManageMedia = async (req, res) => {
  const state = await ManageMedia.findOne({ _id: req.params._id }).exec();
  console.log("get ManageMedia", state);
  res.json(state);
};

exports.updateManageMedia = async (req, res) => {
  try {
    console.log("update", req.body);
    let Media =
      req.file ? `uploads/ManageMedia/${req.file.filename}` : null;

    let fieldvalues = { ...req.body };
    fieldvalues.Media = Media;

    const update = await ManageMedia.findOneAndUpdate(
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
