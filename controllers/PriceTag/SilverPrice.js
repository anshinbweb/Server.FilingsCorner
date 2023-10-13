const SilverPrice = require("../../models/PriceTag/SilverPrice");

exports.getSilverPrice = async (req, res) => {
  const find = await SilverPrice.findOne({ _id: req.params._id }).exec();
  console.log("get Task List", find);
  res.json(find);
};

exports.createSilverPrice = async (req, res) => {
  try {
    console.log(req.body);
    const add = await new SilverPrice(req.body).save();
    res.json(add);
  } catch (err) {
    console.log("log error from create Task List", err);
    return res.status(400).send("create dynamic content failed from Task List");
  }
};

exports.listSilverPrice = async (req, res) => {
  const list = await SilverPrice.find().sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.listSPrice = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match } = req.body;

    let query = [
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
                SilverPrice: { $regex: match, $options: "i" },
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

    const list = await SilverPrice.aggregate(query);
    // console.log(list[0].data);
    // res.json(list);
    if (list && list.length > 0 && list[0].data && list[0].data.length > 0) {
      console.log(list[0].data);
      res.json(list[0].data);
    } else {
      // Handle the case when there is no data to display
      res.json({ message: "No data to display." });
    }
  } catch (error) {
    console.log("display error", error);
    // res.send("err in list", error);
    res.status(500).send("Error in fetching data.");
  }
};

exports.updateSilverPrice = async (req, res) => {
  try {
    const update = await SilverPrice.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update silver List failed");
  }
};

exports.removeSilverPrice = async (req, res) => {
  try {
    const delTL = await SilverPrice.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(delTL);
    res.json(delTL);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete silver  failed");
  }
};
