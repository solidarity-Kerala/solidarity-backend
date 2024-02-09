const { default: mongoose } = require("mongoose");
const Meeting = require("../models/meeting");

// @desc      CREATE NEW MEETING
// @route     POST /api/v1/meeting
// @access    protect
exports.createMeeting = async (req, res) => {
  try {
    const newMeeting = await Meeting.create(req.body);
    res.status(200).json({
      success: true,
      message: "Meeting created successfully",
      data: newMeeting,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL MEETING
// @route     GET /api/v1/meeting
// @access    public
exports.getMeeting = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Meeting.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific Meeting",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, month: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Meeting.countDocuments(),
      parseInt(skip) === 0 && Meeting.countDocuments(query),
      Meeting.find(query)
      .populate("place")
      .populate("attendance")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all Meeting`,
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

// @desc      UPDATE SPECIFICMEETING
// @route     PUT /api/v1/meeting/:id
// @access    protect
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFICMEETING
// @route     DELETE /api/v1/meeting/:id
// @access    protect
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.query.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET MEETING
// @route     GET /api/v1/meeting/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Meeting.find(
      {},
      { _id: 0, id: "$_id", value: "$month" }
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
