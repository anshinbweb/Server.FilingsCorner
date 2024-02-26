const Users = require("../../../models/Auth/User/Users");
const fs = require("fs");

exports.getUsers = async (req, res) => {
  try {
    const find = await Users.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createUsers = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/userImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/userImages`);
    }

    let userImage = req.file ? `uploads/userImages/${req.file.filename}` : null;
    let {
      firstName,
      lastName,
      contactNo,
      email,
      password,
      IsActive,
      IsPublic,
      followers,
      following,
      cart,
      defaultShippingAddress,
      defaultBillingAddress,
      shippingAddress,
      billingAddress,
    } = req.body;

    let Cart;
    let sa;
    let Followers;
    let Following;
    let ba;
    if (
      shippingAddress == undefined ||
      shippingAddress == null ||
      shippingAddress == ""
    ) {
      sa = [];
    }
    if (
      billingAddress == undefined ||
      billingAddress == null ||
      billingAddress == ""
    ) {
      ba = [];
    }
    if (followers == undefined || followers == null || followers == "") {
      Followers = [];
    }
    if (cart == undefined || cart == null || cart == "") {
      Cart = [];
    }
    if (following == undefined || following == null || following == "") {
      Following = [];
    }

    const emailExists = await Users.findOne({
      email: req.body.email,
    }).exec();
    if (emailExists) {
      return res.status(200).json({
        isOk: false,
        message: "Email already exists",
      });
    } else {
      // const add = await new Users(req.body).save();
      const add = await new Users({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        contactNo: contactNo,
        IsActive: IsActive,
        IsPublic: IsPublic,
        followers: Followers,
        following: Following,
        cart: Cart,
        defaultShippingAddress: defaultShippingAddress,
        defaultBillingAddress: defaultBillingAddress,
        shippingAddress: sa,
        billingAddress: ba,
        userImage: userImage,
      }).save();

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

exports.listUsers = async (req, res) => {
  try {
    const list = await Users.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listUsersByParams = async (req, res) => {
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

    const list = await Users.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUsers = async (req, res) => {
  try {
    let userImage = req.file ? `uploads/userImages/${req.file.filename}` : null;
    let fieldvalues = { ...req.body };
    if (userImage != null) {
      fieldvalues.userImage = userImage;
    }

    const update = await Users.findOneAndUpdate(
      { _id: req.params._id },
      // req.body,
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeUsers = async (req, res) => {
  try {
    const del = await Users.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

// exports.userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const findData = await Users.findOne({
//       email,
//       password,
//     }).exec();
//     console.log("find", findData);
//     if (findData) {
//       return res.status(200).json({
//         isOk: true,
//         data: findData,
//         message: "Authentication Successfull",
//       });
//     } else {
//       return res.status(200).json({
//         isOk: false,
//         message: "Authentication Failed",
//       });
//       // res.status(200).send("Authentication Failed!");
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// };

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usermp = await Users.findOne({ email: email }).exec();
    if (usermp) {
      if (usermp.password !== password) {
        console.log("Password didn't match");
        return res.status(200).json({
          isOk: false,
          filed: 1,
          message: "Authentication Failed",
        });
      } else {
        res.status(200).json({
          isOk: true,
          message: "Authentication Successfull",
          data: usermp,
        });
      }
    } else {
      res.status(200).json({
        isOk: false,
        message: "user Not found",
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(200)
      .json({ isOk: false, message: "An error occurred while logging in" });
  }
};

exports.ChangePasswordUser = async (req, res) => {
  try {
    const { userId, password, newPassword, ConfirmPassword } = req.body;
    console.log("req.body", req.body);
    const user = await Users.findById({ _id: userId }).exec();
    if (user) {
      if (user.password === password) {
        if (ConfirmPassword !== newPassword) {
          return res.status(200).json({
            isOk: false,
            field: 1,
            message: "Confirm password does not matches",
          });
        } else {
          const user = await Users.findOne({ _id: userId }).exec();
          user.password = newPassword;
          user.save();
          console.log("Password updated successfully", user);
          return res.status(200).json({
            isOk: true,
            message: "Password updated successfully",
            data: user,
          });
        }
      } else {
        return res.status(200).json({
          isOk: false,
          field: 2,

          message: "password is Incorrect",
        });
      }
    } else {
      return res.status(200).json({
        field: 3,

        isOk: false,
        message: "user not found",
      });
    }
  } catch (error) {
    console.log("log error from user login", error);
    return res.status(500).json("change password user login failed");
  }
};
