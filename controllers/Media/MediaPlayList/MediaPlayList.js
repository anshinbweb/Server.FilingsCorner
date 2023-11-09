const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const MediaPlayList = require("../../../models/Media/MediaPlayList/MediaPlayList");
const ManageMedia = require("../../../models/Media/ManageMedia");

exports.createMediaPlayList = async (req, res) => {
  try {
    // console.log("req body", req.body);
    const SName = await MediaPlayList.findOne({
      playListName: req.body.playListName,
    });
    if (SName) {
      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "Playlist Name already exists!",
      });
    } else {
      ImagePlaylist(req.body.ad_ids);

        const playList = await MediaPlayList.create({
          playListName: req.body.playListName,
          ad_ids: req.body.ad_ids,
          IsActive: req.body.IsActive,
        });

      res.status(200).json({
        isOk: true,
        data: playList,
      });
    }
  } catch (error) {
    console.log("log error from create playlist", error);
    return res.status(400).send("create playlist failed");
  }
};

async function ImagePlaylist(ad_ids) {
  try {
    let counter = 0;

    for (const adId of ad_ids) {
      const manageMediaData = await ManageMedia.findOne({
        _id: adId,
      });

      console.log("step", adId, manageMediaData);

      if (manageMediaData) {
        console.log("step 1", manageMediaData);
        const imageFilePath = manageMediaData.Media; // Assuming you have a field that contains the image file name
        console.log("step 2", imageFilePath);
        // Copy the image to the uploads/playlist folder
        const sourcePath = path.join( imageFilePath); // Update the source path accordingly
        const destinationPath = path.join(
         
          "uploads/PlayList",
          `${counter}.jpg`
        ); // Update the destination path accordingly
        console.log("step 3", sourcePath, destinationPath);
        try {
          // Copy the image to the destination path
          fs.copyFileSync(sourcePath, destinationPath);
          // resolve(); // Resolve the promise once the copy operation is complete
        } catch (error) {
          console.log(error);
          // reject(error); // Reject the promise in case of an error
        }

        // Increment the counter for the next file
        counter++;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

exports.listMediaPlayList = async (req, res) => {
  const list = await MediaPlayList.find().sort({ createdAt: -1 }).exec();
  // console.log(list);
  res.json(list);
};

exports.removeMediaPlayList = async (req, res) => {
  try {
    const del = await MediaPlayList.findOneAndRemove({
      _id: req.params._id,
    });
    // console.log("deleted playlist", del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete playlist failed");
  }
};

exports.updateMediaPlayList = async (req, res) => {
  try {
    const update = await MediaPlayList.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    // console.log("edit ", update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update  failed");
  }
};

exports.getMediaPlayList = async (req, res) => {
  try {
    const playlist = await MediaPlayList.findOne({
      _id: req.params._id,
    }).exec();
    // console.log("get ", tag);
    res.json(playlist);
  } catch (err) {
    console.log(err);
  }
};

exports.listMediaPlayListByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

  let query = [
    {
      $match: { IsActive: isActive },
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
              playListName: { $regex: match, $options: "i" },
            },
            // {
            //   ad_ids: { $regex: match, $options: "i" },
            // },
          ],
        },
      },
    ].concat(query);
  }

  if (sorton && sortdir) {
    console.log(sortdir, sorton);
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

  const list = await MediaPlayList.aggregate(query);
  res.json(list);
};
