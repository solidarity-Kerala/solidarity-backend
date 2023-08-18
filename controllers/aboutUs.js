const { default: mongoose } = require("mongoose");
const AboutUs = require("../models/AboutUs");

// @desc      CREATE ABOUTUS
// @route     POST /api/v1/about-us
// @access    private
exports.createAboutUs = async (req, res) => {
  try {
    const response = await AboutUs.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added about us",
      response,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ABOUTUS
// @route     GET /api/v1/about-us
// @access    private
exports.getAboutUs = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await AboutUs.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific about us`,
        response,
      });
    }
    // const query = searchkey
    //   ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
    //   : req.filter;
    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { vision: { $regex: searchkey, $options: "i" } },
          { mission: { $regex: searchkey, $options: "i" } },
        ],
      }),
    };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && AboutUs.countDocuments(),
      parseInt(skip) === 0 && AboutUs.countDocuments(query),
      AboutUs.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all about us`,
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

// @desc      UPDATE ABOUTUS
// @route     PUT /api/v1/about-us
// @access    private
exports.updateAboutUs = async (req, res) => {
  try {
    const response = await AboutUs.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific about us",
      enrollment: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE ABOUTUS
// @route     DELETE /api/v1/about-us
// @access    private
exports.deleteAboutUs = async (req, res) => {
  try {
    const aboutus = await AboutUs.findByIdAndDelete(req.query.id);

    if (!aboutus) {
      return res.status(404).json({
        success: false,
        message: "About us not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "About us deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
