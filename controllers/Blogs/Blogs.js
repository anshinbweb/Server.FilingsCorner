const Blogs = require("../../models/Blogs/Blogs");
const fs = require("fs");

exports.getBlogs = async (req, res) => {
  try {
    const find = await Blogs.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.createBlogs = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/blogImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/blogImages`);
    }

    console.log("req.file", req.file);
    console.log("req.body", req.body);
    let blogImage = req.file ? `uploads/blogImages/${req.file.filename}` : null;

    let { blogTitle, blogDesc, likes, comments, userId, IsActive } = req.body;

    let like;
    let comment;
    if (likes == undefined || likes == null || likes == "") {
      like = [];
    }
    if (comments == undefined || comments == null || comments == "") {
      comment = [];
    }

    const add = await new Blogs({
      blogTitle: blogTitle,
      blogImage: blogImage,
      blogDesc: blogDesc,
      likes: like,
      comments: comment,
      userId: userId,
      IsActive: IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listBlogs = async (req, res) => {
  try {
    const list = await Blogs.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listBlogsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "adminusers",
          localField: "userId",
          foreignField: "_id",
          as: "adminuser",
        },
      },
      {
        $unwind: {
          path: "$adminuser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          adminuser: "$adminuser.firstName",
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
                blogTitle: { $regex: match, $options: "i" },
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

    const list = await Blogs.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateBlogs = async (req, res) => {
  try {
    console.log("req.body", req.body);
    let blogImage = req.file ? `uploads/blogImages/${req.file.filename}` : null;
    let fieldvalues = { ...req.body };
    if (blogImage != null) {
      fieldvalues.blogImage = blogImage;
    }

    if (
      fieldvalues.likes == undefined ||
      fieldvalues.likes == null ||
      fieldvalues.likes == ""
    ) {
      fieldvalues.likes = [];
    }
    if (
      fieldvalues.comments == undefined ||
      fieldvalues.comments == null ||
      fieldvalues.comments == ""
    ) {
      fieldvalues.comments = [];
    }

    const update = await Blogs.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    console.log(err);
    return res.status(500).send("error", err);
  }
};

exports.removeBlogs = async (req, res) => {
  try {
    const del = await Blogs.findOneAndRemove({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};
