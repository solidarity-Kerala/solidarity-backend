const mongoose = require("mongoose");
const District = require("../models/district");

// @desc      CREATE NEW DISTRICT
// @route     POST /api/v1/district
// @access    protect
exports.createDistrict = async (req, res) => {
  console.log(req.body);
  try {
    const newDistrict = await District.create(req.body);
    res.status(200).json({
      success: true,
      message: "District created successfully",
      data: newDistrict,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL DISTRICTS
// @route     GET /api/v1/district
// @access    public
exports.getDistricts = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const district = await District.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific district",
        response: district,
      });
    }

    const query = searchkey
      ? { ...req.filter, districtName: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && District.countDocuments(),
      parseInt(skip) === 0 && District.countDocuments(query),
      District.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all districts`,
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

// @desc      UPDATE SPECIFIC DISTRICT
// @route     PUT /api/v1/district/:id
// @access    protect
exports.updateDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "District updated successfully",
      district,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC DISTRICT
// @route     DELETE /api/v1/district/:id
// @access    protect
exports.deleteDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.query.id);

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "District deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET District
// @route     GET /api/v1/District/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await District.find(
      {},
      { _id: 0, id: "$_id", value: "$districtName" }
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
