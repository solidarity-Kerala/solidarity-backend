const { default: mongoose } = require("mongoose");
const Menu = require("../models/menu");

//@desc ADD MENU
//@route POST/api/v1/menu
//@access public
exports.addMenu = async (req, res) => {
  try {
    const response = await Menu.create(req.body);
    res.status(200).json({
      success: true,
      message: `successfully added menu `,
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

// @desc      GET ALL MENU & GET SPECIFIC MENU
// @route     GET /api/v1/menu
// @access    public
exports.getMenu = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Menu.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific menu",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, label: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Menu.countDocuments(),
      parseInt(skip) === 0 && Menu.countDocuments(query),
      Menu.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all menu",
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

// @desc      UPDATE SPECIFIC MENU
// @route     PUT /api/v1/menu
// @access    public
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Menu.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      success: true,
      message: `updated specific menu`,
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

// @desc      DELETE SPECIFIC MENU
// @route     DELETE /api/v1/menu
// @access    public
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Menu.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `deleted specific menu`,
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
