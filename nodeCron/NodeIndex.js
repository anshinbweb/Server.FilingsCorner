const SubscriptionOrders = require("./SubscriptionOrdersCron");

exports.LoadCronJobs = () => {
  try {
    SubscriptionOrders.SubscriptionOrdersCron();
  } catch (error) {
    console.log("error in cron", error);
  }
};
