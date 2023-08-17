const jwt = require("jsonwebtoken");
//
const User = require("../models/User");
// const UserSubscriber = require("../models/UserSubscriber");
const { default: mongoose } = require("mongoose");
const { query } = require("express");

// @desc      create user
// @route     POST /api/v1/user
// @access    public
exports.addUser = async (req, res) => {
  try {
    const {
      username,
      userDisplayName,
      cprNumber,
      email,
      password,
      gender,
      franchise,
      address,
      dateOfBirth,
      userImage,
    } = req.body;

    // Create the user
    const user = await User.create({
      username,
      userDisplayName,
      cprNumber,
      email,
      password,
      userImage,
      userType: req.body?.userType
        ? req.body?.userType
        : new mongoose.Types.ObjectId(req.user?.userType?._id),
      franchise: new mongoose.Types.ObjectId(franchise),
    });

    // Create the userSubscriber
    const userSubscriber = await UserSubscriber.create({
      cprNumber,
      address,
      gender,
      user: user._id,
      dateOfBirth,
    });

    res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user,
      userSubscriber,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      get all users
// @route     GET /api/v1/user
// @access    public
exports.getUser = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const matchQuery = {};
    matchQuery.delete = false;

    if (req.filter.userType && mongoose.isValidObjectId(req.filter.userType)) {
      matchQuery.userType = new mongoose.Types.ObjectId(req.filter.userType);
    }

    if (id && mongoose.isValidObjectId(id)) {
      matchQuery._id = new mongoose.Types.ObjectId(id);
    }

    if (searchkey) {
      const regexSearch = { $regex: searchkey, $options: "i" };
      matchQuery.$or = [
        { userDisplayName: regexSearch },
        { username: regexSearch },
        { location: regexSearch },
      ];
    }

    const pipeline = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "usertypes",
          localField: "userType",
          foreignField: "_id",
          as: "userType",
        },
      },
      {
        $lookup: {
          from: "franchises",
          localField: "franchise",
          foreignField: "_id",
          as: "franchise",
        },
      },
      {
        $lookup: {
          from: "subscribers",
          localField: "_id",
          foreignField: "user",
          as: "subscriber",
        },
      },
      {
        $project: {
          userType: { $arrayElemAt: ["$userType", 0] },
          franchise: { $arrayElemAt: ["$franchise", 0] },
          subscriber: { $arrayElemAt: ["$subscriber", 0] },
          username: 1,
          email: 1,
          userDisplayName: 1,
          userImage: 1,
        },
      },
      { $skip: parseInt(skip) || 0 },
      { $limit: parseInt(limit) || 10 },
    ];

    const [data, filterCount, totalCount] = await Promise.all([
      User.aggregate(pipeline).sort({ _id: -1 }),
      parseInt(skip) === 0 && User.countDocuments(matchQuery),
      parseInt(skip) === 0 && User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: id ? "Retrieved specific User" : "Retrieved all Users",
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      update user
// @route     PUT /api/v1/user
// @access    public
exports.updateUser = async (req, res) => {
  try {
    // req.body.franchise = new mongoose.Types.ObjectId(req.body.franchise);
    // const datas = req.body.userType
    //   ? req.body.userType
    //   : new mongoose.Types.ObjectId(req.user.userType._id);
    // req.body.userType = datas;
    const {
      id,
      address,
      gender,
      username,
      userDisplayName,
      email,
      userImage,
      franchise,
      userType,
    } = req.body;
    const response = await User.findByIdAndUpdate(
      id,
      {
        username,
        userDisplayName,
        email,
        userImage,
        franchise,
        userType,
      },
      { new: true }
    );

    const resp = await UserSubscriber.findOneAndUpdate(
      { user: id },
      {
        address,
        gender,
      }
    );

    return res.status(200).json({
      success: true,
      message: `updated specific sub menu`,
      response,
      resp,
    });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

// @desc      update user field
// @route     PATCH /api/v1/user/update_user_field
// @access    public
exports.updateUserField = async (req, res) => {
  try {
    res.status(200).json({
      message: "successfully updated",
    });
  } catch (err) {
    console.log("all error", err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      delete user
// @route     DELETE /api/v1/user
// @access    public
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const token = req.headers.authorization.split(" ")[1];

    const response = await User.findByIdAndUpdate(id, {
      delete: true,
      deletedBy: id,
      deletedDate: new Date(),
    });
    res.status(200).json({
      success: true,
      message: "succefully deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      filter user with user type
// @route     GET /api/v1/user/filter-user
// @access    protect
exports.filterUser = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await User.find({ userType: id });
    res.status(200).json({
      success: true,
      message: "filtered data",
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET USER'S
// @route     DELETE /api/v1/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    // const role = req.query?.userType?.replace(/\?$/, "") || "";
    const idPattern = /^[a-zA-Z0-9]+/;
    const role = req.query?.userType.match(idPattern)?.[0] || "";
    let query = {};

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user?._id;
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = role;
    } else if (req.user?.userType?.role === "Admin") {
      query.userType = role;
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = role;
    }

    const items = await User.find(query, {
      _id: 0,
      id: "$_id",
      value: "$username",
      Name: "$userDisplayName",
      CprNumber: "$cprNumber",
      Email: "$email",
    });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
