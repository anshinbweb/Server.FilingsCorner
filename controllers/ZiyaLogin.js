const ZiyaLogin = require("../models/ZiyaLogin");

exports.createZiyaLogin = async (req, res) => {
  try {
    console.log("req", req.body);
    const add = await new ZiyaLogin(req.body).save();
    res.json(add);
  } catch (err) {
    console.log("log error from ZiyaLogin", err);
    return res.status(400).send("create dynamic content failed from ZiyaLogin");
  }
};

exports.listZiyaLogin = async (req, res) => {
  const list = await ZiyaLogin.find().sort({ createdAt: -1 }).exec();
  // console.log("list country", list);
  res.json(list);
};
