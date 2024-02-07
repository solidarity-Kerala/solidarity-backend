const User = require("../models/user");
// const Appointment = require("../models/appointment");
const Area = require("../models/area");
const Attendance = require("../models/attendance");
const Bithulmal = require("../models/bithulmal");
const District = require("../models/district");
const Members = require("../models/members");
const Membersgroup = require("../models/membersGroup");
// const Associates = require("../models/associates");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

// @desc      GET COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard
// @access    protect
exports.count = async (req, res) => {
  try {
    const [
      areaCount,
      attendanceCount,
      bithulmalCount,
      districtCount,
      memberCount,
      memberGroupCount,
      // associatesCount,
    ] = await Promise.all([
      Area.countDocuments(),
      Attendance.countDocuments(),
      Bithulmal.countDocuments(),
      District.countDocuments(),
      Members.countDocuments(),
      Membersgroup.countDocuments(),

    ]);
    console.log("count", areaCount);

    res.status(200).json([
      {
        count: districtCount,
        title: "District",
        icon: "District",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: areaCount,
        title: "Area",
        icon: "area",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: memberGroupCount,
        title: "Member Group",
        icon: "memberGroup",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: memberCount,
        title: "Member",
        icon: "member",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      // {
      //   count: associatesCount,
      //   title: "Associates",
      //   icon: "associate",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
      {
        count: bithulmalCount,
        title: "Bithulmal",
        icon: "bithulmal",
        background: "#ebf1fb",
        color: "#5753cd",
      },
    ]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc      GET PATIENT COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard/dietitian
// @access    protect
exports.patientCount = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          dietician: new mongoose.Types.ObjectId(req.query.dietitian),
        },
      },
      {
        $group: {
          _id: null,
          patients: { $sum: 1 },
          admittedPatients: {
            $sum: {
              $cond: [{ $ne: ["$admissionDate", null] }, 1, 0],
            },
          },
        },
      },
    ];

    const result = await Appointment.aggregate(pipeline);

    const { patients, admittedPatients } = result[0];

    res.status(200).json({
      patients,
      admittedPatients,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
