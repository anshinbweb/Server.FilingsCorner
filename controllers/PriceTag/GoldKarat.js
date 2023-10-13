const GoldKarat = require("../../models/PriceTag/GoldKarat");

exports.getGoldKarat = async (req, res) => {
  const find = await GoldKarat.findOne({ _id: req.params._id }).exec();
  console.log("get Task List", find);
  res.json(find);
};

exports.createGoldKarat = async (req, res) => {
  try {
    console.log(req.body);
    const add = await new GoldKarat(req.body).save();
    res.json(add);
  } catch (err) {
    console.log("log error from create Task List", err);
    return res.status(400).send("create dynamic content failed from Task List");
  }
};

exports.listGoldKarat = async (req, res) => {
  const list = await GoldKarat.find().sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.listGKarat = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },

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
                GoldKarat: { $regex: match, $options: "i" },
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

    const list = await GoldKarat.aggregate(query);
    // console.log(list[0].data);
    // res.json(list);
    if (list && list.length > 0 && list[0].data && list[0].data.length > 0) {
      console.log(list[0].data);
      //   res.json(list[0].data);
      res.json(list);
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

exports.updateGoldKarat = async (req, res) => {
  try {
    const update = await GoldKarat.findOneAndUpdate(
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

exports.removeGoldKarat = async (req, res) => {
  try {
    const delTL = await GoldKarat.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(delTL);
    res.json(delTL);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete silver  failed");
  }
};
