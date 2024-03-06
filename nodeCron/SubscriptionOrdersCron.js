const cron = require("node-cron");
const NodeCron = require("../models/NodeCronRecord/NodeCron");
const { default: mongoose } = require("mongoose");

const OrderDetails = require("../models/Products/Orders/OrderDetailsNew");
const Orders = require("../models/Products/Orders/OrderNew");
const ProductDetails = require("../models/Products/Products/ProductDetails");
const ProductVariants = require("../models/Products/Products/ProductVariants");
const SubscriptionMaster = require("../models/Subscription/SubscriptionMaster");
const moment = require("moment");

exports.SubscriptionOrdersCron = () => {
  cron.schedule("00 00 * * *", async () => {
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
          const product = await ProductDetails.findOne({
            _id: order.productId,
          });
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

          console.log(
            "6",
            totalAmount,
            newOrderDetail.amount,
            oldOrder.shippingCharge
          );

          let randomOrderId = Math.random()
            .toString(36)
            .slice(2, 10)
            .padEnd(8, "0");

          let existingOrder = await Orders.findOne({ randomOrderId });

          while (existingOrder) {
            randomOrderId = Math.random()
              .toString(36)
              .slice(2, 10)
              .padEnd(8, "0");
            existingOrder = await Orders.findOne({ randomOrderId });
          }

          const newOrder = new Orders({
            ...oldOrder.toObject(),
            _id: new mongoose.Types.ObjectId(),
            subTotal: newOrderDetail.amount,
            totalAmount: totalAmount,
            orderId: [newOrderDetail._id],
            randomOrderId: randomOrderId,
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

      const existingEntry = await NodeCron.findOne({
        CronName: "SubscriptionOrdersCron",
      });
      if (existingEntry) {
        const update = await NodeCron.findOneAndUpdate(
          { CronName: "SubscriptionOrdersCron" },
          {
            updatedAt: new Date(),
            message: "completed",
          },
          // { WhatsappMessage: redisResult },
          { new: true }
        );

        await update.save();
        console.log("updated entry");
      } else {
        // If the entry doesn't exist, create a new entry
        const newEntry = new NodeCron({
          CronName: "App QR Cron",
          updatedAt: new Date(),
          message: "completed",
        });
        console.log("created entry");
        await newEntry.save();
      }
      // return res.status(200).send("completed!");
    } catch (error) {
      console.error("Error running qrCreate:", error);
    }
  });
};
