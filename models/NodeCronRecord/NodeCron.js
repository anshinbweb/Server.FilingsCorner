const mongoose = require("mongoose");

const NodeCronSchema = new mongoose.Schema({
  CronName: {
    type: String,
  },
  message: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("NodeCron", NodeCronSchema);
