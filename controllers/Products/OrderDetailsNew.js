const OrderDetails = require("../../models/Products/OrderDetailsNew");
const Orders = require("../../models/Products/OrderNew");
const ProductDetails = require("../../models/Products/Products/ProductDetails");
const ProductVariants = require("../../models/Products/Products/ProductVariants");
const SubscriptionMaster = require("../../models/Subscription/SubscriptionMaster");

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
        const product = await ProductVariants.findOne({
          _id: body[i].productVariantsId,
        }).exec();
        body[i].amount =
          product.priceVariant * body[i].quantity -
          (product.priceVariant * body[i].quantity * discount) / 100;
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
