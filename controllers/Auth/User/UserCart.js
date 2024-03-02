const { default: mongoose } = require("mongoose");
const UserCart = require("../../../models/Auth/User/UserCart");
const User = require("../../../models/Auth/User/Users");
const ProductDetails = require("../../../models/Products/Products/ProductDetails");
const ProductVariants = require("../../../models/Products/Products/ProductVariants");
const SubscriptionMaster = require("../../../models/Subscription/SubscriptionMaster");

exports.createUserCart = async (req, res) => {
  try {
    const { userId, productId, subsId, productVariantsId, quantity } = req.body;
    console.log("req.body", req.body);
    console.log("subsId", subsId);

    const checkCart = await UserCart.findOne({
      userId: userId,
      productId: productId,
      productVariantsId: productVariantsId,
    });
    if (checkCart) {
      req.body.quantity = checkCart.quantity + quantity;
      this.updateQuantity(req, res);
    } else {
      // CHECK STOCK
      let amount = 0;
      let discount = 0;
      if (subsId) {
        const subs = await SubscriptionMaster.findOne({
          _id: subsId,
        }).exec();
        discount = subs.savePercentage;
      }

      const productAmount = await ProductDetails.findOne({ _id: productId });
      if (amount.isOutOfStock) {
        return res.status(200).json({
          isOk: false,
          message: "Product is out of stock",
        });
      }
      if (productVariantsId == null) {
        amount = productAmount.basePrice * quantity;
        console.log("amount", amount);
      } else {
        amount = await ProductVariants.findOne({ _id: productVariantsId });
        if (amount.isOutOfStock) {
          return res.status(200).json({
            isOk: false,
            message: "Product is out of stock",
          });
        }
        amount = (amount.priceVariant + productAmount.basePrice) * quantity;
        console.log("amount", amount);
      }

      amount = amount - (amount * discount) / 100;

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
      let ans = add.toObject();
      ans["amount"] = amount;

      res.status(200).json({
        isOk: true,
        message: "UserCart created successfully",
        data: ans,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getUserCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("req.params", req.params);

    // aggregate query to get productname from productId and subsname from subsId
    let query = [
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "productdetailsnews",
          localField: "productId",
          foreignField: "_id",
          as: "productDetailsData",
        },
      },
      {
        $lookup: {
          from: "subscriptionmasters",
          localField: "subsId",
          foreignField: "_id",
          as: "subscriptionData",
        },
      },
      {
        $unwind: {
          path: "$productDetailsData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$subscriptionData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          productId: 1,
          subsId: 1,
          productVariantsId: 1,
          quantity: 1,
          productImage: "$productDetailsData.productImage",
          productName: "$productDetailsData.productName",
          subsName: "$subscriptionData.title",
        },
      },
    ];

    // const userCart = await UserCart.find({ userId: userId }).exec();
    const userCart = await UserCart.aggregate(query).exec();

    let list = [];
    let subTotal = 0;
    for (let i = 0; i < userCart.length; i++) {
      let amount = 0;
      let discount = 0;
      if (userCart[i].subsId != null) {
        const subs = await SubscriptionMaster.findOne({
          _id: userCart[i].subsId,
        }).exec();
        discount = subs.savePercentage;
      }

      const productAmount = await ProductDetails.findOne({
        _id: userCart[i].productId,
      });
      if (userCart[i].productVariantsId == null) {
        amount = productAmount.basePrice * userCart[i].quantity;
      } else {
        amount = await ProductVariants.findOne({
          _id: userCart[i].productVariantsId,
        });
        amount =
          (amount.priceVariant + productAmount.basePrice) *
          userCart[i].quantity;
      }
      amount = amount - (amount * discount) / 100;
      let cartItem = userCart[i];
      subTotal += amount;
      cartItem["amount"] = amount / cartItem.quantity;
      list.push(cartItem);

      // list.push(userCart[i]);
      // list[i]["amount"] = amount;
    }

    // let query = [
    //   { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    //   {
    //     $lookup: {
    //       from: "subscriptionmasters",
    //       localField: "subsId",
    //       foreignField: "_id",
    //       as: "subscriptionData",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "productdetailsnews",
    //       localField: "productId",
    //       foreignField: "_id",
    //       as: "productDetailsData",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "productvariants",
    //       localField: "productVariantsId",
    //       foreignField: "_id",
    //       as: "productVariantsData",
    //     },
    //   },
    //   { $unwind: { path: "$subscriptionData" } },
    //   { $unwind: { path: "$productDetailsData" } },
    //   { $unwind: { path: "$productVariantsData" } },
    //   {
    //     $project: {
    //       // ... retain any other fields from your original 'UserCart' documents

    //       amount: {
    //         // $subtract: [
    //         //   {
    //         $cond: [
    //           { $ne: ["$productVariantsId", null] },
    //           {
    //             $multiply: ["$productVariantsData.priceVariant", "$quantity"],
    //           },
    //           { $multiply: ["$productDetailsData.basePrice", "$quantity"] },
    //         ],
    //       },
    //       // {
    //       //   $multiply: [
    //       //     // Same price calculation as above ...
    //       //     "$subscriptionData.savePercentage",
    //       //     0.01, // Divide the percentage by 100
    //       //   ],
    //       // },
    //       // ],
    //     },
    //     // productData: {
    //     //   // Merging product information
    //     //   $cond: [
    //     //     { $ne: ["$productVariantsId", null] },
    //     //     "$productVariantsData",
    //     //     "$productDetailsData",
    //     //   ],
    //     // },
    //   },
    // ];

    // const list = await UserCart.aggregate(query).exec();

    res
      .status(200)
      .json({ data: list, subTotal: subTotal, shippingCharge: 20 });
  } catch (error) {
    console.log("error in getUserCartByUserId", error);
    return res.status(500).json("error in getUserCartByUserId", error);
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, productVariantsId, quantity } = req.body;
    console.log("req.params", req.params);

    const findData = await UserCart.findOne({
      userId: userId,
      productId: productId,
      productVariantsId: productVariantsId,
    });
    console.log("findData", findData);

    const ID = findData._id;

    // const amt = findData.amount * Qt;
    const updatedCart = await UserCart.findByIdAndUpdate(
      { _id: ID },
      { quantity: quantity },
      { new: true }
    );
    console.log("updatedCart", updatedCart);

    // find amount
    let amount = 0;
    let discount = 0;
    if (updatedCart.subsId != null) {
      const subs = await SubscriptionMaster.findOne({
        _id: updatedCart.subsId,
      }).exec();
      discount = subs.savePercentage;
    }

    const productAmount = await ProductDetails.findOne({
      _id: updatedCart.productId,
    });
    if (updatedCart.productVariantsId == null) {
      amount = productAmount.basePrice * quantity;
    } else {
      amount = await ProductVariants.findOne({
        _id: updatedCart.productVariantsId,
      });
      amount = (amount.priceVariant + productAmount.basePrice) * quantity;
    }
    amount = amount - (amount * discount) / 100;

    res.status(200).json({
      isOk: true,
      quantity: quantity,
      amount: amount,
      message: "UserCart updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.RemoveFromCart = async (req, res) => {
  try {
    const { userId, productId, productVariantsId } = req.body;

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
