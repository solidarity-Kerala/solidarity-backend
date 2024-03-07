const { default: mongoose } = require("mongoose");
const Attendance = require("../models/attendance");
const Members = require("../models/members");

// @desc      CREATE NEW ATTENDANCE
// @route     POST /api/v1/attendance
// @access    protect
exports.createAttendance = async (req, res) => {
  try {
    const newAttendance = await Attendance.create(req.body);
    res.status(200).json({
      success: true,
      message: "Attendance created successfully",
      data: newAttendance,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL ATTENDANCES
// @route     GET /api/v1/attendance
// @access    public
exports.getAttendances = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const attendance = await Attendance.findById(id)
        .populate("group")
        .populate("member");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific attendance",
        response: attendance,
      });
    }

    let query;
    query = searchkey
      ? { ...req.filter, month: { $regex: searchkey, $options: "i" } }
      : req.filter;

    if (req.query?.startDate && req.query?.startDate) {
      query = {
        date: {
          $gte: req.query?.startDate,
          $lte: req.query?.endDate,
        },
      };
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Attendance.countDocuments(),
      parseInt(skip) === 0 && Attendance.countDocuments(query),
      Attendance.find(query)
        .populate("group")
        .populate("member")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all attendance`,
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

// @desc      UPDATE SPECIFIC ATTENDANCE
// @route     PUT /api/v1/attendance/:id
// @access    protect
exports.updateAttendance = async (req, res) => {
  try {
    const id = req.body.id;
    const updateData = req.body;
    // Find the attendance record by ID
    const attendance = await Attendance.findById(id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    // Update existing members' status and add new members if they don't exist
    updateData.members.forEach((updateMember) => {
      const existingMember = attendance.members.find(member => 
        member.member.equals(updateMember.member)
      );

      if (existingMember) {
        // Update existing member's status
        existingMember.status = updateMember.status;
      } else {
        // Add new member to the attendance
        attendance.members.push({
          member: updateMember.member,
          status: updateMember.status,
        });
      }
    });

    // Save the updated attendance
    const updatedAttendance = await attendance.save();
    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC ATTENDANCE
// @route     DELETE /api/v1/attendance/:id
// @access    protect
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.query.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

exports.getMemberAttendance = async (req, res) => {
  try {
    const { groupId, memberId } = req.query;

    // Validate group and member IDs
    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group or member ID",
      });
    }

    // Find attendance data for the specified group and member
    const attendanceData = await Attendance.find({
      group: groupId,
      "members.member": memberId,
    });

    // Format the response with required fields
    const formattedResponse = attendanceData.map((attendance) => ({
      month: attendance.month,
      date: attendance.date,
      status: attendance.members.find((member) => member.member.toString() === memberId).status,
    }));

    res.status(200).json({
      success: true,
      message: `Retrieved specific attendance by member`,
      response: formattedResponse,
      count: formattedResponse.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// @desc      GET Attendance Report by Member Group
// @route     GET /api/v1/attendance/report/membergroup
// @access    public
exports.getAttendanceReportByMemberGroup = async (req, res) => {
  try {
    const { searchkey, group } = req.query;

    // Define the base query
    let query = {};

    // If group parameter is provided, add it to the query
    if (group && mongoose.isValidObjectId(group)) {
      query.group = new mongoose.Types.ObjectId(group);
    }

    // If searchkey parameter is provided, add it to the query for additional filtering
    if (searchkey) {
      query.groupName = { $regex: searchkey, $options: "i" };
    }

    // Calculate total present and absent for each member group
    const groupAttendances = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$group",
          totalPresent: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "membersgroups", // Replace with the actual name of the member group collection
          localField: "_id",
          foreignField: "_id",
          as: "groupInfo",
        },
      },
      {
        $unwind: "$groupInfo",
      },
      {
        $project: {
          _id: 0,
          group: "$_id",
          groupName: "$groupInfo.groupName",
          totalPresent: 1,
          totalAbsent: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved Attendance report by member group",
      response: groupAttendances,
      count: groupAttendances.length,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};


exports.getAttendanceReportByMonth = async (req, res) => {
  try {
    const { searchkey } = req.query;

    // Define and set the query based on the searchkey parameter if provided
    const query = searchkey
      ? { month: { $regex: searchkey, $options: "i" } }
      : {};

    // Calculate total present and absent for each month
    const monthAttendances = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$month",
          totalPresent: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalPresent: 1,
          totalAbsent: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved Attendance report by month",
      response: monthAttendances,
      count: monthAttendances.length,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.getAttendanceByMember = async (req, res) => {
  try {
    const { member, startMonth, endMonth } = req.query;

    if (!member || !mongoose.isValidObjectId(member)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member provided.",
      });
    }

    // Convert the startMonth and endMonth strings to JavaScript Date objects
    const startDate = new Date(startMonth);
    const endDate = new Date(endMonth);

    // Ensure that the endDate is greater than or equal to the startDate
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date range. The end date should be greater than or equal to the start date.",
      });
    }

    // Find the attendance records for the specified member and within the date range
    const attendance = await Attendance.find({
      member: member,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      message: `Retrieved attendance for member with ID: ${member}`,
      response: attendance,
      count: attendance.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

exports.getPresentAbsentMembersByMonth = async (req, res) => {
  try {
    const { startMonth, endMonth } = req.query;

    // Convert the startMonth and endMonth strings to JavaScript Date objects
    const startDate = new Date(startMonth);
    const endDate = new Date(endMonth);

    // Ensure that the endDate is greater than or equal to the startDate
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date range. The end date should be greater than or equal to the start date.",
      });
    }

    // Find the attendance records within the date range
    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("member");

    // Initialize variables to store present and absent members
    const presentMembers = [];
    const absentMembers = [];

    // Iterate through the attendance records and categorize members into present and absent lists
    attendance.forEach((record) => {
      if (record.status === "Present") {
        presentMembers.push(record.member);
      } else if (record.status === "Absent") {
        absentMembers.push(record.member);
      }
    });

    // Count the number of present and absent members
    const presentCount = presentMembers.length;
    const absentCount = absentMembers.length;

    res.status(200).json({
      success: true,
      message: "Retrieved present and absent members by month",
      response: {
        presentMembers,
        absentMembers,
        presentCount,
        absentCount,
      },
      presentCount,
      absentCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

exports.getPresentAbsentMembersByMonthwithcount = async (req, res) => {
  try {
    const startDate = new Date(req.query?.startDate);
    const endDate = new Date(req.query?.endDate);
    const groupId = req.query?.group;
    const memberId = req.query?.member;

    const query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (groupId) {
      query.group = new mongoose.Types.ObjectId(groupId);
    }

    if (memberId) {
      query.member = new mongoose.Types.ObjectId(memberId);
    }

    const memberGroupMonthAttendances = await Attendance.find(query).populate(
      "group member"
    );

    const attendanceCounts = memberGroupMonthAttendances.reduce(
      (counts, attendance) => {
        counts[attendance.status] = (counts[attendance.status] || 0) + 1;
        return counts;
      },
      {}
    );

    console.log("Attendance Counts:", attendanceCounts);

    res.status(200).json({
      success: true,
      message:
        "Retrieved present and absent count of each member by group and month",
      response: memberGroupMonthAttendances,
      absentAttendances: attendanceCounts["Absent"] || 0,
      presentAttendances: attendanceCounts["Present"] || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ATTENDANCE BY GROUP
// @route     GET /api/v1/attendance/by-group
// @access    protect
exports.getAttendanceByGroup = async (req, res) => {
  try {
    const startDate = new Date(req.query?.startDate);
    const endDate = new Date(req.query?.endDate);
    const groupId = req.query?.group;

    const query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (groupId) {
      query.group = new mongoose.Types.ObjectId(groupId);
    }

    const attendances = await Attendance.find(query);

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    const memberCounts = {};

    for (const attendance of attendances) {
      const memberId = attendance.member.toString();
      if (!memberCounts[memberId]) {
        memberCounts[memberId] = {
          Present: 0,
          Absent: 0,
        };
      }
      memberCounts[memberId][attendance.status]++;
    }

    const memberIds = Object.keys(memberCounts);
    const memberNames = {};

    for (const memberId of memberIds) {
      const member = await Members.findById(memberId);
      if (member) {
        memberNames[memberId] = member.name;
      }
    }

    const memberCountsResult = Object.keys(memberCounts).map((memberId) => {
      return {
        memberName: memberNames[memberId] || "",
        Present: memberCounts[memberId].Present,
        Absent: memberCounts[memberId].Absent,
      };
    });

    res.status(200).json({
      success: true,
      message: "Attendance retrieved successfully",
      memberCounts: memberCountsResult,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
