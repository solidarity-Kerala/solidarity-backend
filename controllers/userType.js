const UserTypes = require("../models/UserTypes");
const { default: mongoose } = require("mongoose");

// @desc      ADD USER TYPE
// @route     POST /api/user/user_type
// @access    public
exports.addUserType = async (req, res) => {
  try {
    const response = await UserTypes.create(req.body);
    res.status(200).json({
      success: true,
      message: `succefully added user type ${response.userTypeName}`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET SPECIFIC USER TYPE
// @route     GET /api/user/user_type
// @access    protect
exports.getUserType = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await UserTypes.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific UserTypes",
        response,
      });
    }

    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { role: { $regex: searchkey, $options: "i" } },
          { roleDisplayName: { $regex: searchkey, $options: "i" } },
        ],
      }),
    };

    const filterCount =
      skip && parseInt(skip) === 0 ? await UserTypes.countDocuments(query) : 0;
    const totalCount =
      skip && parseInt(skip) === 0 ? await UserTypes.countDocuments() : 0;

    const data = await UserTypes.find(query)
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10);

    res.status(200).json({
      success: true,
      message: `Retrieved all Franchises`,
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      UPDATE SPECIFIC USER TYPE
// @route     PUT /api/user/user_type
// @access    public
exports.updateUserType = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await UserTypes.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific user type`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC USER TYPE
// @route     DELETE /api/user/user_type
// @access    public
exports.deleteUserType = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await UserTypes.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific user type`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET USER TYPE'S
// @route     GET /api/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await UserTypes.find(
      {},
      { _id: 0, id: "$_id", value: "$roleDisplayName" }
    );
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
