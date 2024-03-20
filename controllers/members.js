const { default: mongoose } = require("mongoose");
const Members = require("../models/members");
const MemberGroup = require("../models/membersGroup");

// @desc      CREATE NEW MEMBER
// @route     POST /api/v1/members
// @access    protect
exports.createMember = async (req, res) => {
  try {
    // const newMember = await Members.create({ ...req.body, userType: "Member" });
    const newMember = await Members.create({
      name: req.body?.name,
      unit: req.body?.unit,
      address: req.body?.name,
      mobileNumber: req.body?.mobileNumber,
      bloodGroup: req.body?.bloodGroup,
      profession: req.body?.profession,
      qualification: req.body?.qualification,
      areaOfInterest: req.body?.mobileNumber,
      bithulmal: req.body?.bithulmal,
      dob: req.body?.dob,
      memberStatus: req.body?.memberStatus,
      designation: req.body?.designation || null,
      group: req.body?.group,
      email: req.body?.email,
      userType: "Member",
    });
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
        .populate("group")
        // .populate("unit");
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
        .populate("group")
        // .populate("unit")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    console.log(query);

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

// exports.getMembersByMemberGroup = async (req, res) => {
//   try {
//     const { groupId } = req.query;

//     if (!groupId || !mongoose.isValidObjectId(groupId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid groupId provided.",
//       });
//     }

//     const members = await Members.find({ groupId: groupId })
//       .populate("memberStatus")
//       .populate("designation")
//       .populate("groupId");

//     const group = await Membersgroup.findById(groupId);

//     if (!group) {
//       return res.status(404).json({
//         success: false,
//         message: "Members group not found.",
//       });
//     }

//     const memberCount = await Members.countDocuments({ groupId: groupId });

//     res.status(200).json({
//       success: true,
//       message: `Retrieved members for group: ${group.groupName}`,
//       response: members,
//       count: memberCount,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while processing the request.",
//     });
//   }
// };


exports.getMembersByMemberGroup = async (req, res) => {
  try {
    console.log(req.query, "req.query");
    const groupId = req.query.id; // Access 'id' from req.query

    // Check if groupId is provided and valid
    if (!groupId || !mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    // Find all group items for the specified group ID
    const membersGroupDetails = await Members.find({ group: groupId }).populate("group");

    // If no group items found, return 404
    if (!membersGroupDetails || membersGroupDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No group items found for the specified member ID",
      });
    }

    // Return the group details
    res.status(200).json({
      success: true,
      message: "Retrieved group items by member ID",
      response: membersGroupDetails,
    });
  } catch (err) {
    console.error(err);
    // Handle any unexpected errors
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.getMembersListByMemberGroup = async (req, res) => {
  try {
    const groupId = req.query.id; // Access 'id' from req.query

    // Check if groupId is provided and valid
    if (!groupId || !mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member group ID",
      });
    }

    // Find all members for the specified group ID
    const members = await Members.find({ group: groupId }).populate("group");

    // If no members found, return 404
    if (!members || members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No members found for the specified member group ID",
      });
    }

    // Initialize count variables
    let activeMemberCount = 0;
    let abroadMemberCount = 0;
    let inactiveMemberCount = 0;

    // Initialize list of members
    let memberList = [];

    // Calculate member counts and populate member list
    members.forEach(member => {
      if (member.group && member.group.status === true) { // Check if group status is true
        activeMemberCount++;
        if (member.isAbroad) {
          abroadMemberCount++;
        }
        memberList.push(member);
      } else {
        inactiveMemberCount++;
      }
    });

    // Return the member counts and member list
    res.status(200).json({
      success: true,
      message: "Retrieved member details and counts by member group ID",
      response: {
        counts: {
          active: activeMemberCount,
          abroad: abroadMemberCount,
          inactive: inactiveMemberCount
        },
        memberList: memberList
      }
    });
  } catch (err) {
    console.error(err);
    // Handle any unexpected errors
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.getReportByMemberGroup = async (req, res) => {
  try {
    const { month, year } = req.query; // Assuming month and year are provided in the query parameters

    // Check if month and year are provided
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required parameters",
      });
    }

    // Find member groups for the given month and year
    const memberGroups = await MemberGroup.find({ month, year });

    // Fetch members for each member group
    let members = [];
    for (const memberGroup of memberGroups) {
      const membersInGroup = await Members.find({ memberGroup: memberGroup._id });
      members = members.concat(membersInGroup);
    }

    // Initialize counts
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    // Calculate counts
    members.forEach(member => {
      if (member.attendance.status === 'present') {
        presentCount++;
      } else if (member.attendance.status === 'absent') {
        absentCount++;
      } else if (member.attendance.status === 'leave') {
        leaveCount++;
      }
    });

    // Fetch meeting management data if needed

    // Construct the report object
    const report = {
      month,
      year,
      presentCount,
      absentCount,
      leaveCount,
      // Include meeting management data if needed
    };

    // Return the report
    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      report
    });
  } catch (err) {
    console.error(err);
    // Handle any unexpected errors
    res.status(500).json({
      success: false,
      message: err.toString(),
    });
  }
};