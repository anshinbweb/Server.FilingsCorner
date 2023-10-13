const GoldPrice = require("../../models/PriceTag/GoldPrice");

exports.getGoldPrice = async (req, res) => {
  const find = await GoldPrice.findOne({ _id: req.params._id }).exec();
  console.log("get gold price", find);
  res.json(find);
};

exports.createGoldPrice = async (req, res) => {
  try {
    const newGoldPrice = new GoldPrice(req.body);

    // Set IsActive to false for all existing GoldPrice documents
    await GoldPrice.updateMany({}, { $set: { IsActive: false } });

    // Set the new document as active
    newGoldPrice.IsActive = true;
    const savedGoldPrice = await newGoldPrice.save();
    res.json(savedGoldPrice);
  } catch (err) {
    console.log("Error creating GoldPrice", err);
    return res.status(400).send("Failed to create dynamic content for gold.");
  }
};

exports.listGoldPrice = async (req, res) => {
  const list = await GoldPrice.find().sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.listLatestGoldPrice = async (req, res) => {
  const list = await GoldPrice.findOne().sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.listGPrice = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "goldkarats",
          localField: "GoldCarat",
          foreignField: "_id",
          as: "goldkarat",
        },
      },
      {
        $unwind: {
          path: "$goldkarat",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          goldkarat: "$goldkarat.GoldKarat",
        },
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
                GoldPrice: { $regex: match, $options: "i" },
              },
              {
                GoldCarat: { $regex: match, $options: "i" },
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

    const list = await GoldPrice.aggregate(query);
    // console.log(list[0].data);
    // res.json(list);
    if (list && list.length > 0 && list[0].data && list[0].data.length > 0) {
      console.log(list[0].data);
      // res.json(list[0].data);
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

exports.updateGoldPrice = async (req, res) => {
  try {
    const update = await GoldPrice.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    console.log(update);
    res.json(update);
  } catch (err) {
    console.log(err);
    res.status(400).send("update Task List failed");
  }
};

exports.removeGoldPrice = async (req, res) => {
  try {
    const delTL = await GoldPrice.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(delTL);
    res.json(delTL);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete Task List failed");
  }
};
