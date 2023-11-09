const ContactUs = require("../../models/ContactUS/ContactUs");

exports.getContactUs = async (req, res) => {
  try {
    const find = await ContactUs.findOne({ _id: req.params._id }).exec();
    console.log("get Task List", find);
    res.json(find);
  } catch (error) {
    console.log("log error from get contact us", error);
    return res
      .status(400)
      .send("create dynamic content failed from contact us");
  }
};

exports.createContactUs = async (req, res) => {
  try {
    console.log(req.body);
    const add = await new ContactUs(req.body).save();
    res.json(add);
  } catch (err) {
    console.log("log error from create Task List", err);
    return res.status(400).send("create dynamic content failed from Task List");
  }
};

exports.listContactUs = async (req, res) => {
  try {
    const list = await ContactUs.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    console.log("log error from create contact us", error);
    return res
      .status(400)
      .send("list dynamic content failed from list contact us");
  }
};

exports.listCUs = async (req, res) => {
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
                ContactName: { $regex: match, $options: "i" },
              },
              {
                ContactEmail: { $regex: match, $options: "i" },
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

    const list = await ContactUs.aggregate(query);

    if (list && list.length > 0 && list[0].data && list[0].data.length > 0) {
      console.log(list[0].data);
      //   res.json(list[0].data);
      res.json(list);
    } else {
      res.json({ message: "No data to display." });
    }
  } catch (error) {
    console.log("display error", error);
    // res.send("err in list", error);
    res.status(500).send("Error in fetching data.");
  }
};

exports.removeInquiry = async (req, res) => {
  try {
    const del = await ContactUs.findOneAndRemove({
      _id: req.params._id,
    });
    console.log(del);
    res.json(del);
  } catch (err) {
    console.log(err);
    res.status(400).send("delete Inquiry failed");
  }
};
