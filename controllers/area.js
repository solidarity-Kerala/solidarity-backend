const { default: mongoose } = require("mongoose");
const Area = require("../models/Area");

// @desc      CREATE NEW AREA
// @route     POST /api/v1/area
// @access    protect
exports.createArea = async (req, res) => {
  try {
    const newArea = await Area.create(req.body);
    res.status(200).json({
      success: true,
      message: "Area created successfully",
      data: newArea,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL AREAS
// @route     GET /api/v1/area
// @access    public
exports.getAreas = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const area = await Area.findById(id).populate("district");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific area",
        response: area,
      });
    }

    const query = searchkey
      ? { ...req.filter, areaName: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Area.countDocuments(),
      parseInt(skip) === 0 && Area.countDocuments(query),
      Area.find(query)
        .populate("district")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all areas`,
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

// @desc      UPDATE SPECIFIC AREA
// @route     PUT /api/v1/area/:id
// @access    protect
exports.updateArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Area updated successfully",
      data: area,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC AREA
// @route     DELETE /api/v1/area/:id
// @access    protect
exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.query.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Area deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET Area
// @route     GET /api/v1/area/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Area.find(
      {},
      { _id: 0, id: "$_id", value: "$areaName" }
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
