const userNotifcation = require("../../models/Notifications/notification");
const mongoose = require("mongoose");
exports.createuserNotifcation = async (req, res) => {
  try {
    const {
      UserId,
      Type,
      Description,
      //   URL,
      // IsRead
    } = req.body;
    console.log(
      UserId,
      Type,
      Description,
      // URL,
      IsRead
    );
    const addNotification = await new userNotifcation({
      UserId,
      Type,
      Description,
      //   URL,
      //   IsRead,
    }).save();
    res.json(addNotification);
  } catch (err) {
    return res.status(400).json("error in create user notification", err);
  }
};

exports.updateUserNotification = async (req, res) => {
  try {
    const update = await userNotifcation.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update user notification failed");
  }
};

exports.removeUserNotification = async (req, res) => {
  try {
    const delUserNotifiy = await Prospect.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(delUserNotifiy);
  } catch (err) {
    console.log(err);
    res.status(500).json("delete user notification failed");
  }
};

exports.listuserNotification = async (req, res) => {
  try {
    const notificationList = await userNotifcation.find().exec();
    res.json(notificationList);
  } catch (error) {
    console.log(err);
    res.status(500).json("list user notification failed");
  }
};

exports.getuserNotification = async (req, res) => {
  const notification = await userNotifcation
    .find({ _id: req.params._id })
    .exec();
  res.json(notification);
};

exports.getuserAllNotification = async (req, res) => {
  const notificationAll = await userNotifcation
    .find({ UserId: req.params._id })
    .sort({ createdAt: -1 })
    .exec();
  res.json(notificationAll);
};

// exports.listuserNotifcations = async (req, res) => {
//   try {
//     const { page = 1, size = 10, search = "", userId } = req.query;

//     const query = {
//       $and: [
//         {
//           $or: [
//             { Type: { $regex: search, $options: "i" } },
//             { Description: { $regex: search, $options: "i" } },
//           ],
//         },
//         { UserId: userId },
//       ],
//     };
//     const notification = await userNotifcation
//       .find(query)
//       .skip((page - 1) * size)
//       .limit(parseInt(size))
//       .sort({ createdAt: -1 })
//       .exec();
//     const totalNotification = await userNotifcation
//       .countDocuments(query)
//       .exec();
//     res.json({ data: notification, totalNotification });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.listuserNotifcationByparams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match, userId, isActive } = req.body;

  let query = [
    {
      $match: {
        UserId: mongoose.Types.ObjectId(userId),
        isActive: isActive,
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
  if (match) {
    query = [
      {
        $match: {
          $or: [
            {
              Type: { $regex: match, $options: "i" },
            },
            {
              Description: { $regex: match, $options: "i" },
            },
            //   {
            //     URL: { $regex: match, $options: "i" },
            //   },
            //   {
            //     IsRead: { $regex: match, $options: "i" },
            //   },
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

  const list = await userNotifcation.aggregate(query);
  console.log(list);
  res.json(list);
};