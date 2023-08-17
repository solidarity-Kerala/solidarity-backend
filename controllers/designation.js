const { default: mongoose } = require("mongoose");
const Designation = require("../models/Designation");

// @desc      CREATE NEW DESIGNATION
// @route     POST /api/v1/designation
// @access    protect
exports.createDesignation = async (req, res) => {
  try {
    const newDesignation = await Designation.create(req.body);
    res.status(200).json({
      success: true,
      message: "Designation created successfully",
      data: newDesignation,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL DESIGNATION
// @route     GET /api/v1/designation
// @access    public
exports.getDesignation = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const designation = await Designation.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific designation",
        response: designation,
      });
    }

    const query = searchkey
      ? { ...req.filter, designation: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Designation.countDocuments(),
      parseInt(skip) === 0 && Designation.countDocuments(query),
      Designation.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all designation`,
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

// @desc      UPDATE SPECIFIC DESIGNATION
// @route     PUT /api/v1/designation/:id
// @access    protect
exports.updateDesignation = async (req, res) => {
  try {
    const designation = await Designation.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      data: designation,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC DESIGNATION
// @route     DELETE /api/v1/designation/:id
// @access    protect
exports.deleteDesignation = async (req, res) => {
  try {
    const designation = await Designation.findByIdAndDelete(req.query.id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET Designation
// @route     GET /api/v1/designation/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Designation.find(
      {},
      { _id: 0, id: "$_id", value: "$designation" }
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
