const UserCart = require("../../models/Auth/UserCart");
const User = require("../../models/Auth/Users");
exports.createUserCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      subsId,
      quantity,
      amount,
      sizeId,
      drinkId,
      milkCategory,
    } = req.body;
    console.log("req.body", req.body);
    const add = await new UserCart({
      userId,
      productId,
      subsId,
      quantity,
      amount,
      sizeId,
      drinkId,
      milkCategory,
    }).save();
    console.log("data id", add._id);
    const usercartID = add._id;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { cart: usercartID } },
      { new: true }
    );
    console.log("user add", user);

    res.status(200).json({
      isOk: true,
      message: "UserCart created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, counterValue } = req.params;
    console.log("req.params", req.params);
    const findData = await UserCart.findOne({
      userId: userId,
      productId: productId,
    });
    console.log("findData", findData);
    const ID = findData._id;
    let Qt = findData.quantity;
    if (counterValue === "increment") {
      Qt = findData.quantity + 1;
    } else {
      Qt = findData.quantity - 1;
    }
    const amt = findData.amount * Qt;
    const updatedCart = await UserCart.findByIdAndUpdate(
      { _id: ID },
      { quantity: Qt, amount: amt },
      { new: true }
    );
    console.log("updatedCart", updatedCart);

    res.status(200).json({
      isOk: true,
      quantity: updatedCart.quantity,
      amount: updatedCart.amount,
      message: "UserCart updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.RemoveFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log("req.params", req.params);
    const findData = await UserCart.findOne({
      userId: userId,
      productId: productId,
    });
    console.log("findData", findData);
    const ID = findData._id;
    const updatedUserCart = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cart: ID } },
      { new: true }
    );
    console.log("Product removed", updatedUserCart);

    res.status(200).json({
      isOk: true,
      message: "Product removed successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
