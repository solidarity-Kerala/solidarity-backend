const { default: mongoose } = require("mongoose");
const MenuRole = require("../models/MenuRole");
const Menu = require("../models/Menu");

//@desc ADD MENU ROLE
//@route POST/api/v1/menu-role
//@access public
exports.addMenuRole = async (req, res) => {
  try {
    const response = await MenuRole.create(req.body);
    res.status(200).json({
      success: true,
      message: `successfully added menu role `,
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

// @desc      GET SPECIFIC MENU ROLE
// @route     GET /api/v1/menu-role
// @access    public
exports.getMenuRole = async (req, res) => {
  try {
    const { id } = req.query;
    if (mongoose.isValidObjectId(id)) {
      const response = await MenuRole.findById(id).populate("userType");
      if (!response) {
        return res.status(404).json({
          success: false,
          message: "menu role not found.",
        });
      }
      res.status(200).json({
        success: true,
        message: `retrieved specific menu role`,
        response,
      });
    } else {
      const response = await MenuRole.find().populate("userType");
      res.status(200).json({
        success: true,
        message: `retrieved all menu role`,
        response,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

exports.getMenuRole = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await MenuRole.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu role",
        response,
      });
    }

    const query = searchkey ? { ...req.filter, label: { $regex: searchkey, $options: "i" } } : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && MenuRole.countDocuments(),
      parseInt(skip) === 0 && MenuRole.countDocuments(query),
      MenuRole.find(query)
        .populate("userType")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: "Retrieved all menu role",
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

// @desc      UPDATE SPECIFIC MENU ROLE
// @route     PUT /api/v1/menu-role
// @access    public
exports.updateMenuRole = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await MenuRole.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific menu role`,
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

// @desc      DELETE SPECIFIC MENU ROLE
// @route     DELETE /api/v1/menu-role
// @access    public
exports.deleteMenuRole = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await MenuRole.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific menu role`,
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
