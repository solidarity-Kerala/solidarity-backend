const { default: mongoose } = require("mongoose");
const Franchise = require("../models/Franchise");

// @desc      CREATE NEW FRANCHISE
// @route     POST /api/v1/franchises
// @access    protect
exports.createFranchise = async (req, res) => {
  try {
    const newFranchise = await Franchise.create(req.body);
    res.status(200).json({
      success: true,
      message: "Franchise created successfully",
      data: newFranchise,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL FRANCHISES
// @route     GET /api/v1/franchises
// @access    public
exports.getFranchise = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Franchise.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific Franchise",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Franchise.countDocuments(),
      parseInt(skip) === 0 && Franchise.countDocuments(query),
      Franchise.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all Franchises`,
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

// @desc      UPDATE SPECIFIC FRANCHISE
// @route     PUT /api/v1/franchises/:id
// @access    protect
exports.updateFranchise = async (req, res) => {
  try {
    const franchise = await Franchise.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!franchise) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Franchise updated successfully",
      data: franchise,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC FRANCHISE
// @route     DELETE /api/v1/franchises/:id
// @access    protect
exports.deleteFranchise = async (req, res) => {
  try {
    const franchise = await Franchise.findByIdAndDelete(req.query.id);

    if (!franchise) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Franchise deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET FRANCHISES
// @route     GET /api/v1/franchises/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Franchise.find(
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
