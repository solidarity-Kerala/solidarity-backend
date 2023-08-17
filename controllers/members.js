const { default: mongoose } = require("mongoose");
const Members = require("../models/Members");
const Membersgroup = require("../models/Membersgroup");

// @desc      CREATE NEW MEMBER
// @route     POST /api/v1/members
// @access    protect
exports.createMember = async (req, res) => {
  console.log(req.body);
  try {
    const newMember = await Members.create(req.body);
    res.status(200).json({
      success: true,
      message: "Member created successfully",
      data: newMember,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL MEMBERS
// @route     GET /api/v1/members
// @access    public
exports.getMembers = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const member = await Members.findById(id)
        .populate("memberStatus")
        .populate("designation")
        .populate("groupId");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific member",
        response: member,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Members.countDocuments(),
      parseInt(skip) === 0 && Members.countDocuments(query),
      Members.find(query)
        .populate("memberStatus")
        .populate("designation")
        .populate("groupId")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all members`,
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

// @desc      UPDATE SPECIFIC MEMBER
// @route     PUT /api/v1/members/:id
// @access    protect
exports.updateMember = async (req, res) => {
  try {
    const member = await Members.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
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

// @desc      DELETE SPECIFIC MEMBER
// @route     DELETE /api/v1/members/:id
// @access    protect
exports.deleteMember = async (req, res) => {
  try {
    const member = await Members.findByIdAndDelete(req.query.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET member
// @route     GET /api/v1/member/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Members.find(
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

// @desc      GET ALL MEMBERS BELONGING TO A SPECIFIC AREA
// @route     GET /api/v1/members/area/:areaId/members
// @access    public

// Controller function to retrieve all members by area

exports.getMembersByArea = async (req, res) => {
  console.log("data", req.query);
  try {
    // Get the areaId from the URL parameter
    const areaId = req.query.areaId;

    // Find the Membersgroup with the given areaId to check if it exists
    const area = await Membersgroup.findOne({ area: areaId });

    console.log({ area });

    if (!area) {
      return res.json({
        success: true,
        message: "No members found for the given area",
        response: [],
        count: 0,
      });
    }

    // Find all members with the given areaId
    const members = await Members.find({ groupId: area._id });

    console.log({ members });

    if (members.length === 0) {
      return res.json({
        success: true,
        message: "No members found for the given area",
        response: [],
        count: 0,
      });
    }

    return res.json({
      success: true,
      message: "Retrieved all members in the area",
      response: members,
      count: members.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while retrieving members by area",
      error: error.message,
    });
  }
};

exports.getMembersByMemberGroup = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId || !mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid groupId provided.",
      });
    }

    const members = await Members.find({ groupId: groupId })
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

    const memberCount = await Members.countDocuments({ groupId: groupId });

    res.status(200).json({
      success: true,
      message: `Retrieved members for group: ${group.groupName}`,
      response: members,
      count: memberCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};
