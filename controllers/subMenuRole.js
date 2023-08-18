const { default: mongoose } = require("mongoose");
const SubMenuRole = require("../models/SubMenuRole");

// @desc      ADD SUB MENU ROLE
// @route     POST /api/v1/submenu-role
// @access    public
exports.addSubMenuRole = async (req, res) => {
  try {
    const response = await SubMenuRole.create(req.body);
    res.status(200).json({
      success: true,
      message: `successfully added sub menu role`,
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

// @desc      GET SPECIFIC SUB MENU ROLE
// @route     GET /api/v1/submenu-role
// @access    public
exports.getSubMenuRole = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await SubMenuRole.findById(id).populate("userType");
      return res.status(200).json({
        success: true,
        message: `Retrieved specific sub menu role`,
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, label: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && SubMenuRole.countDocuments(),
      parseInt(skip) === 0 && SubMenuRole.countDocuments(query),
      SubMenuRole.find(query)
        .populate("userType")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all sub menu role",
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

// @desc      UPDATE SPECIFIC SUB MENU ROLE
// @route     PUT /api/v1/submenu-role
// @access    public
exports.updateSubMenuRole = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await SubMenuRole.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific sub menu role`,
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

// @desc      DELETE SPECIFIC SUB MENU ROLE
// @route     DELETE /v1/submenu-role
// @access    public
exports.deleteSubMenuRole = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await SubMenuRole.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific sub menu role`,
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
