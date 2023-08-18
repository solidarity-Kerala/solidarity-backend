const { default: mongoose } = require("mongoose");
const SubMenu = require("../models/SubMenu");

//@desc ADD SUB MENU
//@route POST/api/v1/sub-menu
//@access public
exports.addSubMenu = async (req, res) => {
  try {
    const response = await SubMenu.create(req.body);
    res.status(200).json({
      success: true,
      message: `successfully added sub menu `,
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

// @desc      GET SPECIFIC SUB MENU
// @route     GET /api/v1/sub-menu
// @access    public
exports.getSubMenu = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await SubMenu.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific submenu",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, label: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && SubMenu.countDocuments(),
      parseInt(skip) === 0 && SubMenu.countDocuments(query),
      SubMenu.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all submenu",
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

// @desc      UPDATE SPECIFIC SUB MENU
// @route     PUT /api/v1/sub-menu
// @access    public
exports.updateSubMenu = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await SubMenu.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific sub menu`,
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

// @desc      DELETE SPECIFIC SUB MENU
// @route     DELETE /api/v1/sub-menu
// @access    public
exports.deleteSubMenu = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await SubMenu.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific sub menu`,
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
