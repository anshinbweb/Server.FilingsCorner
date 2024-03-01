const { Long } = require("mongodb");
const Orders = require("../../../models/Products/Orders/OrderNew");
const OrderDetails = require("../../../models/Products/Orders/OrderDetailsNew");

exports.getOrders = async (req, res) => {
  try {
    const find = await Orders.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createOrders = async (req, res) => {
  try {
    const body = req.body;

    let amount = 0;
    for (let i = 0; i < body.orderId.length; i++) {
      const order = await OrderDetails.findOne({ _id: body.orderId[i] }).exec();
      amount += order.amount;
    }
    body.totalAmount = amount;

    const add = await new Orders(body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listOrders = async (req, res) => {
  try {
    const list = await Orders.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listOrdersByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match } = req.body;

    let query = [
      // {
      //   $match: { IsActive: IsActive },
      // },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "username",
        },
      },
      {
        $unwind: {
          path: "$username",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          username: "$username.firstName",
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
                name: { $regex: match, $options: "i" },
              },
              {
                countryname: { $regex: match, $options: "i" },
              },
              {
                statename: { $regex: match, $options: "i" },
              },
              {
                cityname: { $regex: match, $options: "i" },
              },
              {
                username: { $regex: match, $options: "i" },
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

    const list = await Orders.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send("error in list", error);
  }
};

exports.updateOrders = async (req, res) => {
  try {
    const update = await Orders.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeOrders = async (req, res) => {
  try {
    const del = await Orders.findOneAndUpdate(
      {
        _id: req.params._id,
      },

      { OrderStatus: "Cancelled" }
    );
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const find = await Orders.find({ userId: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const update = await Orders.findOneAndUpdate(
      { _id: req.params._id },
      { OrderStatus: req.body.OrderStatus },
      { new: true }
    );
    res.json(update);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateDeliveryDate = async (req, res) => {
  try {
    const update = await Orders.findOneAndUpdate(
      { _id: req.params._id },
      { deliveryDate: req.body.deliveryDate },
      { new: true }
    );
    res.json(update);
  } catch (error) {
    return res.status(400).send(error);
  }
};
