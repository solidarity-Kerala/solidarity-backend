const { default: mongoose } = require("mongoose");
const About = require("../models/about");

// @desc      CREATE NEW About
// @route     POST /api/v1/about
// @access    protect
exports.createAbout = async (req, res) => {
  try {
    const newAbout = await About.create(req.body);
    res.status(200).json({
      success: true,
      message: "About created successfully",
      data: newAbout,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL aboutS
// @route     GET /api/v1/about
// @access    public
exports.getAbouts = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const About = await About.findById(id).populate("district");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific About",
        response: About,
      });
    }

    const query = searchkey
      ? { ...req.filter, aboutName: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && About.countDocuments(),
      parseInt(skip) === 0 && About.countDocuments(query),
      About.find(query)
        .populate("district")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all abouts`,
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

// @desc      UPDATE SPECIFIC About
// @route     PUT /api/v1/about/:id
// @access    protect
exports.updateAbout = async (req, res) => {
  try {
    const About = await About.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!About) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "About updated successfully",
      data: About,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC About
// @route     DELETE /api/v1/about/:id
// @access    protect
exports.deleteAbout = async (req, res) => {
  try {
    const About = await About.findByIdAndDelete(req.query.id);

    if (!About) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "About deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET About
// @route     GET /api/v1/about/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await About.find(
      {},
      { _id: 0, id: "$_id", value: "$aboutName" }
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
