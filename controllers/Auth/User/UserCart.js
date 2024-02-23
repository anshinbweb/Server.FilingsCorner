const UserCart = require("../../../models/Auth/User/UserCart");
const User = require("../../../models/Auth/User/Users");
const ProductDetails = require("../../../models/Products/Products/ProductDetails");
const ProductVariants = require("../../../models/Products/Products/ProductVariants");

exports.createUserCart = async (req, res) => {
  try {
    const { userId, productId, subsId, productVariantsId, quantity } = req.body;
    console.log("req.body", req.body);

    // CHECK STOCK
    let amount = 0;
    if (productVariantsId == null) {
      amount = await ProductDetails.findOne({ _id: productId });
      if (amount.isOutOfStock) {
        return res.status(200).json({
          isOk: false,
          message: "Product is out of stock",
        });
      }
      amount = amount.basePrice * quantity;
      console.log("amount", amount);
    } else {
      amount = await ProductVariants.findOne({ _id: productVariantsId });
      if (amount.isOutOfStock) {
        return res.status(200).json({
          isOk: false,
          message: "Product is out of stock",
        });
      }
      amount = amount.priceVariant * quantity;
      console.log("amount", amount);
    }

    const add = await new UserCart({
      userId,
      productId,
      subsId,
      productVariantsId,
      quantity,
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
      amount: amount,
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
    // const amt = findData.amount * Qt;
    const updatedCart = await UserCart.findByIdAndUpdate(
      { _id: ID },
      { quantity: Qt },
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
    const { userId, productId, productVariantsId } = req.params;
    console.log("req.params", req.params);
    const findData = await UserCart.findOneAndRemove({
      userId: userId,
      productId: productId,
      productVariantsId: productVariantsId,
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
