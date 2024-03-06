const { Long } = require("mongodb");
const Orders = require("../../../models/Products/Orders/OrderNew");
const OrderDetails = require("../../../models/Products/Orders/OrderDetailsNew");
const ProductDetails = require("../../../models/Products/Products/ProductDetails");
const ProductVariants = require("../../../models/Products/Products/ProductVariants");
const SubscriptionMaster = require("../../../models/Subscription/SubscriptionMaster");
const User = require("../../../models/Auth/User/Users");
const UserCart = require("../../../models/Auth/User/UserCart");
const { mongoose } = require("mongoose");

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
    body.subTotal = amount;

    if (body.isShippingType) {
      body.shippingCharge = 20;
      body.totalAmount = body.subTotal + body.shippingCharge;
    } else {
      body.shippingCharge = 0;
      body.totalAmount = body.subTotal;
    }

    const add = await new Orders(body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.createOrderInOneGo = async (req, res) => {
  try {
    let body = req.body;
    body.orderId = [];

    let product = req.body.products;

    for (let i = 0; i < product.length; i++) {
      let discount = 0;
      if (product[i].subsId) {
        const subs = await SubscriptionMaster.findOne({
          _id: product[i].subsId,
        }).exec();
        discount = subs.savePercentage;
      }

      if (product[i].productVariantsId) {
        const productVariant = await ProductVariants.findOne({
          _id: product[i].productVariantsId,
        }).exec();
        const productDetail = await ProductDetails.findOne({
          _id: product[i].productId,
        }).exec();

        product[i].amount =
          (productVariant.priceVariant + productDetail.basePrice) *
            product[i].quantity -
          ((productVariant.priceVariant + productDetail.basePrice) *
            product[i].quantity *
            discount) /
            100;
      } else {
        const product = await ProductDetails.findOne({
          _id: product[i].productId,
        }).exec();
        product[i].amount =
          product.basePrice * product[i].quantity -
          (product.basePrice * product[i].quantity * discount) / 100;
      }
    }

    const added = await OrderDetails.insertMany(product);

    for (let i = 0; i < added.length; i++) {
      body.orderId.push(added[i]._id);
    }

    let amount = 0;
    for (let i = 0; i < body.orderId.length; i++) {
      const order = await OrderDetails.findOne({ _id: body.orderId[i] }).exec();
      amount += order.amount;
    }
    body.subTotal = amount;

    if (body.isShippingType) {
      body.shippingCharge = 20;
      body.totalAmount = body.subTotal + body.shippingCharge;
    } else {
      body.shippingCharge = 0;
      body.totalAmount = body.subTotal;
    }

    let randomOrderId = Math.random().toString(36).slice(2, 10).padEnd(8, "0");

    let existingOrder = await Orders.findOne({ randomOrderId });

    while (existingOrder) {
      randomOrderId = Math.random().toString(36).slice(2, 10).padEnd(8, "0");
      existingOrder = await Orders.findOne({ randomOrderId });
    }
    console.log("existingRandomId", randomOrderId);

    // Assign the unique random order ID to the body object
    body.randomOrderId = randomOrderId;

    const add = await new Orders(body).save();
    for (let i = 0; i < added.length; i++) {
      const update = await OrderDetails.findOneAndUpdate(
        { _id: added[i]._id },
        { orderId: add._id },
        { new: true }
      );
    }

    const remove = await UserCart.deleteMany({ userId: body.userId });
    const user = await User.updateOne(
      { _id: body.userId },
      { $set: { cart: [] } },
      { new: true }
    );

    res.json(add);
  } catch (err) {
    console.log(err);
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
          from: "usershippingaddressmasters",
          localField: "shippingAddress",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $set: {
      //     username: "$username.firstName",
      //   },
      // },

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
    const findOrders = await Orders.find({ userId: req.params.userId }).exec();
    console.log("get order by userid", findOrders);
    res.json(findOrders);
  } catch (error) {
    return res.status(500).json("error in get order by userid", error);
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

exports.getLatestOrderByUser = async (req, res) => {
  try {
    let query = [
      {
        $match: { userId: new mongoose.Types.ObjectId(req.params.userId) },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 1,
      },
      {
        $unwind: { path: "$orderId", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "userbillingaddressmasters",
          localField: "billingAddress",
          foreignField: "_id",
          as: "billingAddress",
        },
      },
      {
        $unwind: { path: "$billingAddress", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "usershippingaddressmasters",
          localField: "shippingAddress",
          foreignField: "_id",
          as: "shippingDetails",
        },
      },
      {
        $unwind: { path: "$shippingDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "ordersdetilsnews",
          localField: "orderId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "productdetailsnews",
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "subscriptionmasters",
          localField: "orderDetails.subsId",
          foreignField: "_id",
          as: "subsDetails",
        },
      },
      {
        $unwind: { path: "$subsDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          orderId: { $push: "$orderId" },
          randomOrderId: { $push: "$randomOrderId" },
          orderStatus: { $first: "$OrderStatus" },
          orderDetails: { $push: "$orderDetails" },
          shippingDetails: { $first: "$shippingDetails" },
          billingAddress: { $first: "$billingAddress" },
          userDetails: { $first: "$userDetails" },
          productDetails: { $push: "$productDetails" },
          subsDetails: { $push: "$subsDetails" },
          deliveryDate: { $first: "$deliveryDate" },
          isShippingType: { $first: "$isShippingType" },
          shippingCharge: { $first: "$shippingCharge" },
          totalAmount: { $first: "$totalAmount" },
          subTotal: { $first: "$subTotal" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          orderId: 1,
          randomOrderId: 1,
          orderStatus: 1,
          orderDetails: 1,
          shippingDetails: 1,
          billingAddress: 1,
          // userDetails: 1,
          userFirstName: "$userDetails.firstName",
          userLastName: "$userDetails.lastName",
          productDetails: 1,
          productVariants: 1,
          subsDetails: 1,
          deliveryDate: 1,
          isShippingType: 1,
          shippingCharge: 1,
          totalAmount: 1,
          subTotal: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const find = await Orders.aggregate(query).exec();

    // const find = await Orders.find({ userId: req.params._id })
    //   .sort({ createdAt: -1 })
    //   .limit(1)
    //   .exec();
    res.json(find);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.getSubscriptionProductofUser = async (req, res) => {
  try {
    let query = [
      {
        $match: { userId: new mongoose.Types.ObjectId(req.params.userId) },
      },
      // {
      //   $sort: { createdAt: -1 },
      // },
      // {
      //   $limit: 1,
      // },
      {
        $unwind: { path: "$orderId", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $lookup: {
      //     from: "userbillingaddressmasters",
      //     localField: "billingAddress",
      //     foreignField: "_id",
      //     as: "billingAddress",
      //   },
      // },
      // {
      //   $unwind: { path: "$billingAddress", preserveNullAndEmptyArrays: true },
      // },
      // {
      //   $lookup: {
      //     from: "usershippingaddressmasters",
      //     localField: "shippingAddress",
      //     foreignField: "_id",
      //     as: "shippingDetails",
      //   },
      // },
      // {
      //   $unwind: { path: "$shippingDetails", preserveNullAndEmptyArrays: true },
      // },
      {
        $lookup: {
          from: "ordersdetilsnews",
          localField: "orderId",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $match: { "orderDetails.isSubs": true }, // Filter to include only order details where isSubs is true
      },
      {
        $lookup: {
          from: "productdetailsnews",
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "subscriptionmasters",
          localField: "orderDetails.subsId",
          foreignField: "_id",
          as: "subsDetails",
        },
      },
      {
        $unwind: { path: "$subsDetails", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "userId",
      //     foreignField: "_id",
      //     as: "userDetails",
      //   },
      // },
      // {
      //   $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      // },

      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          orderId: { $push: "$orderId" },
          orderStatus: { $first: "$orderStatus" },
          orderDetails: { $push: "$orderDetails" },
          // shippingDetails: { $first: "$shippingDetails" },
          // billingAddress: { $first: "$billingAddress" },
          // userDetails: { $first: "$userDetails" },
          productDetails: { $push: "$productDetails" },
          subsDetails: { $push: "$subsDetails" },
          deliveryDate: { $first: "$deliveryDate" },
          isShippingType: { $first: "$isShippingType" },
          shippingCharge: { $first: "$shippingCharge" },
          totalAmount: { $first: "$totalAmount" },
          subTotal: { $first: "$subTotal" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,
          orderId: 1,
          orderStatus: 1,
          orderDetails: 1,
          // shippingDetails: 1,
          // billingAddress: 1,
          // userDetails: 1,
          // userFirstName: "$userDetails.firstName",
          // userLastName: "$userDetails.lastName",
          productDetails: 1,
          productVariants: 1,
          subsDetails: 1,
          deliveryDate: 1,
          isShippingType: 1,
          shippingCharge: 1,
          totalAmount: 1,
          subTotal: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const find = await Orders.aggregate(query).exec();

    // const find = await Orders.find({ userId: req.params._id })
    //   .sort({ createdAt: -1 })
    //   .limit(1)
    //   .exec();
    res.json(find);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
