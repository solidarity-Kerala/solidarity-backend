const { default: mongoose } = require("mongoose");
const Associates = require("../models/Associates");
const Membersgroup = require("../models/Membersgroup");

// @desc      CREATE NEW Associates
// @route     POST /api/v1/associates
// @access    protect
exports.createAssociates = async (req, res) => {
  try {
    const newAssociates = await Associates.create(req.body);
    res.status(200).json({
      success: true,
      message: "Associates created successfully",
      data: newAssociates,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL Associates
// @route     GET /api/v1/associates
// @access    public
exports.getAssociates = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const associate = await Associates.findById(id)
        .populate("memberStatus")
        .populate("designation")
        .populate("groupId");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific associates",
        response: associate,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Associates.countDocuments(),
      parseInt(skip) === 0 && Associates.countDocuments(query),
      Associates.find(query)
        .populate("memberStatus")
        .populate("designation")
        .populate("groupId")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all associates`,
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

// @desc      UPDATE SPECIFIC Associates
// @route     PUT /api/v1/associates/:id
// @access    protect
exports.updateAssociates = async (req, res) => {
  try {
    const associate = await Associates.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Associate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Associate updated successfully",
      data: member,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC Associates
// @route     DELETE /api/v1/associates/:id
// @access    protect
exports.deleteAssociates = async (req, res) => {
  try {
    const associate = await Associates.findByIdAndDelete(req.query.id);

    if (!associate) {
      return res.status(404).json({
        success: false,
        message: "Associates not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Associates deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET Associates
// @route     GET /api/v1/associates/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Associates.find(
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

exports.getAssociatesByMemberGroup = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId || !mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid groupId provided.",
      });
    }

    const associates = await Associates.find({ groupId: groupId })
      .populate("memberStatus")
      .populate("designation")
      .populate("groupId");

    const group = await Membersgroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Members group not found.",
      });
    }

    const associateCount = await Associates.countDocuments({
      groupId: groupId,
    });

    res.status(200).json({
      success: true,
      message: `Retrieved associates for group: ${group.groupName}`,
      response: associates,
      count: associateCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};
