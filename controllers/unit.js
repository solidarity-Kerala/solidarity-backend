const { default: mongoose } = require("mongoose");
const Unit = require("../models/unit");

// @desc      CREATE NEW UNIT
// @route     POST /api/v1/unit
// @access    protect
exports.createUnit = async (req, res) => {
  try {
    const newUnit = await Unit.create(req.body);
    res.status(200).json({
      success: true,
      message: "Unit created successfully",
      data: newUnit,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL UNIT
// @route     GET /api/v1/unit
// @access    public
exports.getUnit = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if(id && mongoose.isValidObjectId(id)) {
      const unit = await Unit.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific unit",
        response: unit,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 &&Unit.countDocuments(),
      parseInt(skip) === 0 &&Unit.countDocuments(query),
     Unit.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all unit`,
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

// @desc      UPDATE SPECIFIC UNIT
// @route     PUT /api/v1/unit/:id
// @access    protect
exports.updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

    if(!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: unit,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC UNIT
// @route     DELETE /api/v1/unit/:id
// @access    protect
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.query.id);

    if(!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET UNIT
// @route     GET /api/v1/unit/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Unit.find(
      {},
      { _id: 0, id: "$_id", value: "$title" }
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