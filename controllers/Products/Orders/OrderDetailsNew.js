const { default: mongoose } = require("mongoose");
const OrderDetails = require("../../../models/Products/Orders/OrderDetailsNew");
const Orders = require("../../../models/Products/Orders/OrderNew");
const ProductDetails = require("../../../models/Products/Products/ProductDetails");
const ProductVariants = require("../../../models/Products/Products/ProductVariants");
const SubscriptionMaster = require("../../../models/Subscription/SubscriptionMaster");
const moment = require("moment");

exports.createOrderDetails = async (req, res) => {
  try {
    const body = req.body;

    for (let i = 0; i < body.length; i++) {
      let discount = 0;
      if (body[i].subsId) {
        const subs = await SubscriptionMaster.findOne({
          _id: body[i].subsId,
        }).exec();
        discount = subs.savePercentage;
      }

      if (body[i].productVariantsId) {
        const productVariant = await ProductVariants.findOne({
          _id: body[i].productVariantsId,
        }).exec();
        const productDetail = await ProductDetails.findOne({
          _id: body[i].productId,
        }).exec();

        body[i].amount =
          (productVariant.priceVariant + productDetail.basePrice) *
            body[i].quantity -
          ((productVariant.priceVariant + productDetail.basePrice) *
            body[i].quantity *
            discount) /
            100;
      } else {
        const product = await ProductDetails.findOne({
          _id: body[i].productId,
        }).exec();
        body[i].amount =
          product.basePrice * body[i].quantity -
          (product.basePrice * body[i].quantity * discount) / 100;
      }
    }

    const add = await OrderDetails.insertMany(req.body);

    res.json(add); // calculate amount here
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const find = await OrderDetails.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listOrderDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
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
        $lookup: {
          from: "productdetails",
          localField: "productId",
          foreignField: "_id",
          as: "productname",
        },
      },
      {
        $unwind: {
          path: "$productname",
          preserveNullAndEmptyArrays: true,
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
                ProductVariants: { $regex: match, $options: "i" },
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

    const list = await OrderDetails.aggregate(query).exec();
    res.json(list);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.updateOrderDetails = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);

    let discount = 0;
    if (body.subsId) {
      const subs = await SubscriptionMaster.findOne({
        _id: body.subsId,
      }).exec();
      discount = subs.savePercentage;
    }

    if (body.productVariantsId) {
      const product = await ProductVariants.findOne({
        _id: body.productVariantsId,
      }).exec();
      body.amount =
        product.priceVariant * body.quantity -
        (product.priceVariant * body.quantity * discount) / 100;
    } else {
      const product = await ProductDetails.findOne({
        _id: body.productId,
      }).exec();
      body.amount =
        product.basePrice * body.quantity -
        (product.basePrice * body.quantity * discount) / 100;
    }

    const update = await OrderDetails.findOneAndUpdate(
      { _id: req.params._id },
      body
    ).exec();

    const updated = await OrderDetails.findOne({ _id: req.params._id }).exec();

    res.json(updated);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.removeOrderDetails = async (req, res) => {
  try {
    const remove = await OrderDetails.findOneAndRemove({
      _id: req.params._id,
    }).exec();
    res.json(remove);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.listOrderDetails = async (req, res) => {
  try {
    const list = await OrderDetails.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (err) {
    return res.status(400).send;
  }
};

exports.getOrderDetailsByOrderId = async (req, res) => {
  try {
    const findOrder = await Orders.findOne({ _id: req.params._id }).exec();

    const find = await OrderDetails.find({
      _id: { $in: findOrder.orderId },
    }).exec();

    res.json(find);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.createSubscriptionOrder = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await OrderDetails.find({
      subsId: { $exists: true },
      isLatestOrder: true,
    });

    console.log("1", orders.length);

    for (const order of orders) {
      const subscription = await SubscriptionMaster.findById(order.subsId);
      console.log("2", subscription);

      if (!subscription) {
        console.log(`Subscription not found for order with ID ${order._id}`);
        continue;
      }

      // Calculate the gap between order date and current date in days
      const orderDate = moment(order.createdAt);
      const currentDate = moment();
      const gapInDays = currentDate.diff(orderDate, "days");

      console.log("3", orderDate, currentDate, gapInDays);

      if (gapInDays === subscription.days) {
        const product = await ProductDetails.findOne({ _id: order.productId });
        const productVariant = await ProductVariants.findOne({
          _id: order.productVariantsId,
        });

        console.log(
          "4",
          product.basePrice,
          productVariant.priceVariant,
          order.quantity
        );

        const amount =
          (parseFloat(product.basePrice) +
            parseFloat(productVariant.priceVariant)) *
          parseInt(order.quantity);

        const newOrderDetail = new OrderDetails({
          ...order.toObject(),
          _id: new mongoose.Types.ObjectId(),
          isSubs: true,
          amount: amount,
          isLatestOrder: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log("5", newOrderDetail);

        const oldOrder = await Orders.findOne({ _id: order.orderId });

        const totalAmount =
          parseFloat(newOrderDetail.amount) +
          parseFloat(oldOrder.shippingCharge);

          console.log("6",totalAmount, newOrderDetail.amount, oldOrder.shippingCharge);

        const newOrder = new Orders({
          ...oldOrder.toObject(),
          _id: new mongoose.Types.ObjectId(),
          subTotal: newOrderDetail.amount,
          totalAmount: totalAmount,
          orderId: [newOrderDetail._id],
          OrderStatus: "Not Processed",
          isLatestOrder: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await newOrder.save();

        newOrderDetail.orderId = newOrder._id;
        await newOrderDetail.save();

        order.isLatestOrder = false;
        await order.save();

        console.log(`New order created for orderdetail ID ${order._id}`);
      }
    }
    return res.status(200).send("completed!");
  } catch (error) {
    console.error("Error generating orders:", error);
  }
};
