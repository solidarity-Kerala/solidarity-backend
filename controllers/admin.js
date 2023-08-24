const { default: mongoose } = require("mongoose");
const membersGroup = require("../models/membersGroup");
const Admin = require('../models/adminModel');

// @desc      CREATE NEW ADMIN
// @route     POST /api/v1/admin
// @access    protect
exports.createAdmin = async (req, res) => {
  console.log(req.body);
  try {
    const { name, username, password, undefined } = req.body
    const newAdmin = await Admin.create({ name, username, password, membersGroupId: undefined });
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: newAdmin,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL Admin
// @route     GET /api/v1/admin
// @access    public
exports.getAdmin = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const admin = await Admin.findById(id)
      return res.status(200).json({
        success: true,
        message: "Retrieved specific admin",
        response: admin,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Admin.countDocuments(),
      parseInt(skip) === 0 && Admin.countDocuments(query),
      Admin.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all admin`,
      response: data,
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

// @desc      UPDATE SPECIFIC ADMIN
// @route     PUT /api/v1/admin/:id
// @access    protect
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC ADMIN
// @route     DELETE /api/v1/admin/:id
// @access    protect
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.query.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET admin
// @route     GET /api/v1/admin/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Admin.find(
      {},
      { _id: 0, id: "$_id", value: "$name" }
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
