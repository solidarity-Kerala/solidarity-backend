const { default: mongoose } = require("mongoose");
const Meeting = require("../models/meeting");
const Attendance = require("../models/attendance");

// @desc      CREATE NEW MEETING
// @route     POST /api/v1/meeting
// @access    protect
exports.createMeeting = async (req, res) => {
  try {
    console.log(req.body);

    // Check if a meeting already exists for the provided date
    const existingMeeting = await Meeting.findOne({ date: req.body.date });

    if (existingMeeting) {
      return res.status(400).json({
        success: false,
        message: "A meeting already exists for this date",
      });
    }

    const membersAttendance = req.body.members.map((member) => ({
      member: member.member,
      status: member.status,
    }));

    const newAttendance = await Attendance.create({
      date: req.body.date,
      place: req.body.place,
      group: req.body.group,
      members: membersAttendance,
      month: req.body.month,
    });

    console.log({ newAttendance });
    
    const newMeeting = await Meeting.create({
      ...req.body,
      attendance: newAttendance._id,
    });
    
    console.log({ newMeeting });

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
    const { id, skip, limit, searchkey, group, monthCount } = req.query;

    let totalStatusCounts = { Present: 0, Absent: 0, Leave: 0 }; // Initialize total status counts

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Meeting.findById(id)
        .populate("place")
        .populate({
          path: "attendance",
          populate: { path: "members.member", model: "Member" },
          options: { strictPopulate: false },
        })
        .populate("group");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific Meeting",
        response,
      });
    }

    let query = {};
    if (group && mongoose.isValidObjectId(group)) {
      query.group = group; // Filter by group
    }
    if (searchkey) {
      query.month = { $regex: searchkey, $options: "i" }; // Add search by month
    }

    // Adjust query based on monthCount
    if (monthCount && !isNaN(monthCount)) {
      const count = monthCount - 1;
      const end = new Date(); // Today's date for reference
      const start = new Date(
        new Date().setMonth(end.getMonth() - parseInt(count))
      );

      console.log(`Start: ${start}`);
      console.log(`End: ${end}`);
      // Ensure the start date is set to the first day of the month at 00:00:00 hours
      start.setDate(1); // First day of the start month
      start.setHours(0, 0, 0, 0); // Start of the day

      // Optionally adjust end date to the end of the current month
      // Not necessary if you're looking to include all up to the current date/time

      query.date = { $gte: start, $lt: end }; // Meetings within the start to end date range
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Meeting.countDocuments(),
      parseInt(skip) === 0 && Meeting.countDocuments(query),
      Meeting.find(query)
        .populate("place")
        .populate({
          path: "attendance",
          populate: { path: "members.member", model: "Member" },
          options: { strictPopulate: false },
        })
        .populate("group")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
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

/// @desc      CHECK IF MEETING HELD ON A SPECIFIC DATE AND RETURN MEETING DETAILS IF HELD, OTHERWISE RETURN CUSTOM MESSAGE
// @route     GET /api/v1/meeting/check-held
// @access    public
exports.checkMeetingHeld = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const meetingDate = new Date(date);
    const month = meetingDate.toLocaleString("default", { month: "long" });

    const meetingOnDate = await Meeting.findOne({
      date: { $eq: meetingDate },
      month,
    })
      .populate("place")
      .populate("attendance");

    if (meetingOnDate) {
      return res.status(200).json({
        success: true,
        message: "Meeting held on the specified date",
        data: meetingOnDate,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No meeting held on the specified date",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
