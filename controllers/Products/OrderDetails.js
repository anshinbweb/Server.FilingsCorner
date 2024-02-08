const OrderDetails = require("../../models/Products/OrdersDetails");

exports.createOrderDetails = async (req, res) => {
  try {
    const add = await new OrderDetails(req.body).save();
    res.json(add);
  } catch (err) {
    return res.status(400).send(err);
  }
};
