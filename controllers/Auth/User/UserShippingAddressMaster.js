const UserShippingAddress = require("../../../models/Auth/User/UserShippingAddressMaster");
const User = require("../../../models/Auth/User/Users");
const mongoose = require("mongoose");
const UserBillingAddress = require("../../../models/Auth/User/UserBillingAddressMaster");

exports.getUserShippingAddress = async (req, res) => {
  try {
    const id = req.params._id; // Assuming req.params.ids is an array of IDs
    const find = await UserShippingAddress.findOne({
      _id: id,
    }).exec();
    console.log("find", find);
    res.json(find);
  } catch (error) {
    return res.status(500).json("eror in get user data", error);
  }
};

exports.updateDefaultAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const find = await User.findOne({ _id: userId }).exec();
    if (find) {
      const sa = find.shippingAddress;
      const index = sa.indexOf(addressId);
      console.log("Index of addressId:", index);

      find.defaultShippingAddress = index;
      find.save();
      res.json(find);
    } else {
      res.status(200).json("user not found");
    }
  } catch (error) {
    return res.status(500).json("error in default address", error);
  }
};

exports.UpdateDefaultShippingAddress = async (req, res) => {
  try {
    const id = req.params._id; // Assuming req.params.ids is an array of IDs
    const find = await UserShippingAddress.findOne({
      _id: id,
    }).exec();
    console.log("find", find);
    res.json(find);
  } catch (error) {
    return res.status(500).json("eror in get user data", error);
  }
};

// GET SHIPPING ADDRESS BY USER ID
exports.getAllShippingAddressofUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const find = await UserShippingAddress.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id), // Assuming you're using Mongoose and need to convert id to ObjectId
          // userId: id,
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
      .json("error in get shipping address of all user", error);
  }
};

exports.createUserShippingAddress = async (req, res) => {
  try {
    const add = await new UserShippingAddress(req.body).save();
    const shippingID = add._id;
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { shippingAddress: shippingID } },
      { new: true }
    );

    if (req.body.isBillingSame) {
      const add = await new UserBillingAddress(req.body).save();
      const billingID = add._id;
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { billingAddress: billingID } },
        { new: true }
      );
    }

    res.json(add);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listUserShippingAddress = async (req, res) => {
  try {
    const list = await UserShippingAddress.find()
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveShippingAddress = async (req, res) => {
  try {
    const list = await UserShippingAddress.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    res.json(list);
  } catch (error) {
    return res.status(400).json("error in list active shipping address", error);
  }
};

// APP
exports.AddUpdateShippingAddress = async (req, res) => {
  try {
    const id = req.body.id;
    const findData = await UserShippingAddress.findOne({ _id: id }).exec();
    if (findData) {
      const update = await UserShippingAddress.findOneAndUpdate(
        { _id: req.params._id },
        req.body,
        { new: true }
      );
      res.json(update);
    } else {
      const add = await new UserShippingAddress(req.body).save();
      res.json(add);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("error in data", err);
  }
};

exports.listUserShippingAddressByParams = async (req, res) => {
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

    const list = await UserShippingAddress.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUserShippingAddress = async (req, res) => {
  try {
    const update = await UserShippingAddress.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeUserShippingAddress = async (req, res) => {
  try {
    const ShippingAdd = await UserShippingAddress.findOne({
      _id: req.params._id,
    });

    if (ShippingAdd) {
      const updatedUserSA = await User.findOne({ _id: ShippingAdd.userId });

      const defaultShippingAddress =
        updatedUserSA.shippingAddress[updatedUserSA.defaultShippingAddress];
      if (defaultShippingAddress == req.params._id) {
        const updatedUserSA = await User.findOneAndUpdate(
          { _id: ShippingAdd.userId },
          {
            $pull: { shippingAddress: req.params._id },
            $set: { defaultShippingAddress: -1 },
          },
          { new: true }
        );
      } else {
        const updatedUserSA = await User.findOneAndUpdate(
          { _id: ShippingAdd.userId },
          { $pull: { shippingAddress: req.params._id } },
          { new: true }
        );

        const sa = updatedUserSA.shippingAddress;
        const index = sa.indexOf(defaultShippingAddress);
        console.log("Index of addressId:", index);

        updatedUserSA.defaultShippingAddress = index;
        updatedUserSA.save();
      }

      const deletedBA = await UserShippingAddress.findOneAndUpdate(
        { _id: req.params._id },
        { $set: { IsActive: false } },
        { new: true }
      );
      console.log("delted", deletedBA);
      res.status(200).json({
        isOk: true,
        message: "Shipping address removed successfully",
        data: {},
      });
    } else {
      console.log("Shipping address not found");
      res
        .status(200)
        .json({ isOk: false, message: "Shipping address not found", data: {} });
    }
  } catch (error) {
    console.log("error in remove", error);
    res.status(500).json({ "error in remove": error });
  }
};
