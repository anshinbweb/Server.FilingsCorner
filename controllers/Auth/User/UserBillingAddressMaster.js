const UserBillingAddress = require("../../../models/Auth/User/UserBillingAddressMaster");
const User = require("../../../models/Auth/User/Users");
const UserShippingAddress = require("../../../models/Auth/User/UserShippingAddressMaster");

const mongoose = require("mongoose");

exports.getUserBillingAddress = async (req, res) => {
  try {
    const find = await UserBillingAddress.findOne({
      _id: req.params._id,
    }).exec();

    res.json(find);
  } catch (error) {
    return res.status(500).json("error in get", error);
  }
};

exports.updateDefaultBillingAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const find = await User.findOne({ _id: userId }).exec();
    if (find) {
      const sa = find.billingAddress;
      const index = sa.indexOf(addressId);
      console.log("Index of addressId:", index);

      find.defaultBillingAddress = index;
      find.save();
      res.json(find);
    } else {
      res.status(200).json("user not found");
    }
  } catch (error) {
    return res.status(500).json("error in default billing address", error);
  }
};

exports.getAllBillingAddressofUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const find = await UserBillingAddress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id), // Assuming you're using Mongoose and need to convert id to ObjectId
          IsActive: true,
        },
      },
      {
        $lookup: {
          from: "countries", // Assuming the name of the country table is "Countries"
          localField: "countryId",
          foreignField: "_id",
          as: "country",
        },
      },
      {
        $unwind: {
          path: "$country",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "states", // Assuming the name of the country table is "Countries"
          localField: "stateId",
          foreignField: "_id",
          as: "state",
        },
      },
      {
        $unwind: {
          path: "$state",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,
          firstName: 1,
          lastName: 1,
          contactNo: 1,
          companyName: 1,
          city: 1,
          State: "$state.StateName", // Replace stateId with state name
          Country: "$country.CountryName", // Replace countryId with country name
          addressLine1: 1,
          addressLine2: 1,
          zipCode: 1,
          isBillingSame: 1,
          IsActive: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]).exec();
    console.log("find", find);
    res.status(200).json(find); // Updated res.json() to res.status().json()
  } catch (error) {
    console.log("error in get", error);
    return res
      .status(500)
      .json("error in get billing address of all user", error);
  }
};

exports.createUserBillingAddress = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const add = await new UserBillingAddress({
      firstName: req.body.firstNameBA,
      lastName: req.body.lastNameBA,
      contactNo: req.body.contactNoBA,
      companyName: req.body.companyNameBA,
      addressLine1: req.body.addressLine1BA,
      addressLine2: req.body.addressLine2BA,
      city: req.body.cityBA,
      stateId: req.body.stateIdBA,
      countryId: req.body.countryIdBA,
      zipCode: req.body.zipCodeBA,
      userId: req.body.userIdBA,
      isBillingSame: req.body.isBillingSameBA,
      IsActive: req.body.IsActiveBA,
    }).save();
    console.log("add", add._id);
    const billingID = add._id;
    const user = await User.findOneAndUpdate(
      { _id: req.body.userIdBA },
      { $addToSet: { billingAddress: billingID } },
      { new: true }
    );

    // if (req.body.isBillingSameBA) {
    //   req.body.isBillingSameBA = true;
    //   const add = await new UserShippingAddress(req.body).save();
    //   const billingID = add._id;
    //   const user = await User.findOneAndUpdate(
    //     { _id: req.body.userId },
    //     { $addToSet: { shippingAddress: billingID } },
    //     { new: true }
    //   );
    // }

    res.json(add);
  } catch (err) {
    console.log(err);
    res.status(500).json("error in create", err);
  }
};

//APP
exports.AddUpdateBillingAddress = async (req, res) => {
  try {
    const id = req.body.id;
    const findData = await UserBillingAddress.findOne({ _id: id }).exec();
    if (findData) {
      const update = await UserBillingAddress.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true }
      );
      res.json(update);
    } else {
      const add = await new UserBillingAddress(req.body).save();
      res.json(add);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("error in data", err);
  }
};

exports.listUserBillingAddress = async (req, res) => {
  try {
    const list = await UserBillingAddress.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    res.status(500).json("error in list user", error);
  }
};

exports.listActiveBillingAddress = async (req, res) => {
  try {
    const list = await UserBillingAddress.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).json("error in list active billing address", error);
  }
};

exports.listUserBillingAddressByParams = async (req, res) => {
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

    const list = await UserBillingAddress.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).json("error in list", error);
  }
};

exports.updateUserBillingAddress = async (req, res) => {
  try {
    const update = await UserBillingAddress.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(500).json("error in update", err);
  }
};

exports.removeUserBillingAddress = async (req, res) => {
  try {
    // Remove billing address
    const BillingAdd = await UserBillingAddress.findOne({
      _id: req.params._id,
    });

    if (BillingAdd) {
      const updatedUserBA = await User.findOne({ _id: BillingAdd.userId });

      const defaultBillingAddress =
        updatedUserBA.billingAddress[updatedUserBA.defaultBillingAddress];
      if (defaultBillingAddress == req.params._id) {
        const updatedUserBA = await User.findOneAndUpdate(
          { _id: BillingAdd.userId },
          {
            $pull: { billingAddress: req.params._id },
            $set: { defaultBillingAddress: -1 },
          },
          { new: true }
        );
      } else {
        const updatedUserBA = await User.findOneAndUpdate(
          { _id: BillingAdd.userId },
          { $pull: { billingAddress: req.params._id } },
          { new: true }
        );
        console.log("updatedUserBA", updatedUserBA);

        const sa = updatedUserBA.billingAddress;
        const index = sa.indexOf(defaultBillingAddress);
        console.log("Index of addressId:", index);

        updatedUserBA.defaultBillingAddress = index;
        updatedUserBA.save();
      }

      const deletedBA = await UserBillingAddress.findOneAndUpdate(
        { _id: req.params._id },
        { $set: { IsActive: false } },
        { new: true }
      );
      console.log("delted", deletedBA);
      res.status(200).json({
        isOk: true,
        message: "Billing address removed successfully",
        data: {},
      });
    } else {
      console.log("Billing address not found");
      res
        .status(200)
        .json({ isOk: false, message: "Billing address not found", data: {} });
    }
  } catch (error) {
    console.log("error in remove", error);
    res.status(500).json({ "error in remove": error });
  }
};

exports.getDefaultBillingAddressByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).exec();
    const billingId = user.billingAddress[user.defaultBillingAddress];
    const find = await UserBillingAddress.findOne({ _id: billingId }).exec();
    res.json(find);
  } catch (error) {
    console.log("error in get default billing address", error);
    return res.status(500).send(error);
  }
};
