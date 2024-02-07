const { default: mongoose } = require("mongoose");
const Download = require("../models/download");

// @desc      CREATE NEW DOWNLOAD
// @route     POST /api/v1/downloads
// @access    protect
exports.createDownload = async (req, res) => {
  try {
    const newDownload = await Download.create(req.body);
    res.status(200).json({
      success: true,
      message: "Download created successfully",
      data: newDownload,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL DOWNLOADS
// @route     GET /api/v1/download
// @access    public
exports.getDownload = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Download.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific Download",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Download.countDocuments(),
      parseInt(skip) === 0 && Download.countDocuments(query),
      Download.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all Downloads`,
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

// @desc      UPDATE SPECIFIC DOWNLOAD
// @route     PUT /api/v1/download/:id
// @access    protect
exports.updateDownload = async (req, res) => {
  try {
    const download = await Download.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if(!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Download updated successfully",
      data: download,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
 
// @desc      DELETE SPECIFIC DOWNLOAD
// @route     DELETE /api/v1/downloads/:id
// @access    protect
exports.deleteDownload = async (req, res) => {
  try {
    const download = await Download.findByIdAndDelete(req.query.id);

    if(!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Download deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET DOWNLOAD
// @route     GET /api/v1/download/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Download.find(
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
