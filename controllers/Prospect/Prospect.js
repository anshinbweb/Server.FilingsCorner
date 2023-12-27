// const { create } = require("../../models/Prospect/Prospect");
const Prospect = require("../../models/Prospect/Prospect");

let gridData = [];

exports.listProspect = async (req, res) => {
  const list = await Prospect.find().sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.listProspectByParams = async (req, res) => {
  let { skip, per_page, sorton, sortdir, match } = req.body;
  console.log("req.body", req.body);

  let query = [
    // {
    //   $match: { IsActive: isActive },
    // },

    {
      $addFields: {
        InqStr: {
          $convert: {
            input: "$InqId",
            to: "string",
          },
        },
      },
    },
    {
      $match: {
        $or: [
          {
            ContactPersonName: new RegExp(match, "i"),
          },
          {
            EmailID: new RegExp(match, "i"),
          },
          {
            City: new RegExp(match, "i"),
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

  const listProspect = await Prospect.aggregate(query);
  res.json(listProspect);
};

exports.createProspect = async (req, res) => {
  try {
    const EmailId = await Prospect.findOne({ EmailID: req.body.EmailID });
    const ContactNumber = await Prospect.findOne({
      ContactNo: req.body.ContactNo,
    });
    if (ContactNumber) {
      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "Contact Number already exists!",
      });
    } else if (EmailId) {
      return res.status(200).json({
        isOk: false,
        field: 2,
        message: "EmailID already exists!",
      });
    } else {
      const addProspect = await new Prospect(req.body).save();
      console.log(addProspect);
      res.status(200).json({ isOk: true, data: addProspect, message: "" });
    }
  } catch (err) {
    console.log("erro in pros", err);
    res.status(400).json({
      isOk: false,
      message: "Please fill out all required fields",
    });
  }
};

exports.getProspect = async (req, res) => {
  console.log("req.params._id", req.params._id);
  const getProspect = await Prospect.findOne({
    _id: req.params._id,
  }).exec();
  console.log("getProspect", getProspect);
  res.json(getProspect);
};

exports.AddToWhislist = async (req, res) => {
  const { userid, productid } = req.body;
  console.log("req", req.body);
  try {
    const user = await Prospect.findOneAndUpdate(
      { _id: userid },
      { $addToSet: { wishlist: productid } },
      { new: true }
    );
    console.log("user add", user);

    res.json(user.wishlist);
  } catch (error) {
    console.log("error in add", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.GetWhishlistUser = async (req, res) => {
  const { userid } = req.params;
  console.log("req", req.params);
  try {
    const user = await Prospect.findById({ _id: userid });
    console.log("cc", user);

    res.json(user.wishlist);
  } catch (error) {
    console.log("error in get", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.RemoveFromWhislist = async (req, res) => {
  const { userid, productid } = req.body;

  try {
    const userRemove = await Prospect.findOneAndUpdate(
      { _id: userid },
      { $pull: { wishlist: productid } },
      { new: true }
    );
    console.log("user remove", userRemove);

    res.json(userRemove.wishlist);
  } catch (error) {
    console.log("err in remove", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserByWP = async (req, res) => {
  try {
    const findData = await Prospect.findOne({
      ContactNo: req.params.ContactNo,
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
      console.log("error in getting", UserID);

      return res.status(200).json({
        isOk: false,
        field: 1,
        message: "No Account found with this Contact Number",
      });
    }
  } catch (err) {
    res.status(400).send("error in get user");
  }
};

exports.removeProspect = async (req, res) => {
  try {
    const delprospect = await Prospect.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(delprospect);
    res.json(delprospect);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete prospect failed");
  }
};

exports.updateProspect = async (req, res) => {
  console.log("Updating...", req.body);
  try {
    const update = await Prospect.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log("edit prospect", update);
    res.json(update);
    console.log("update", update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update prospect failed");
  }
};

// exports.loginmp = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // const usermp = await ShLogin.findOne({ EmailID: email }).exec();
//     const prospect = await Prospect.findOne({ EmailID: email }).exec();

//     if (!usermp || !usermp.IsActive) {
//       if (!prospect || prospect.IsDeleted) {
//         console.log("Prospect not found or is deleted");
//         return res.status(200).json({
//           isOk: false,
//           field: 2,
//           message: "User not found or Inquiry Pending",
//         });
//       }
//       console.log("User not found or Inquiry Pending");
//       return res.status(200).json({
//         isOk: false,
//         field: 1,
//         message: "User not found or Inquiry Pending",
//       });
//     }

//     if (usermp.Password !== password) {
//       console.log("Password didn't match");
//       return res.status(200).json({
//         isOK: false,
//         filed: 3,
//         message: "Password didn't match",
//       });
//     }

//     console.log(usermp);
//     res
//       .status(200)
//       .json({ isOk: true, message: "Login Successful", usermp: usermp });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(200)
//       .json({ isOk: false, message: "An error occurred while logging in" });
//   }
// };
