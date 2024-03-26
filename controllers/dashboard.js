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
// exports.patientCount = async (req, res) => {
//   try {
//     const pipeline = [
//       {
//         $match: {
//           dietician: new mongoose.Types.ObjectId(req.query.dietitian),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           patients: { $sum: 1 },
//           admittedPatients: {
//             $sum: {
//               $cond: [{ $ne: ["$admissionDate", null] }, 1, 0],
//             },
//           },
//         },
//       },
//     ];

//     const result = await Appointment.aggregate(pipeline);

//     const { patients, admittedPatients } = result[0];

//     res.status(200).json({
//       patients,
//       admittedPatients,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// @desc      GET REPORT DATA
// @route     GET /api/v1/dashboard/report
// @access    protect

exports.report = async (req, res) => {
  console.log("req.query", req.query);
  const { month, district } = req.query;

  try {
    // Find the district ObjectId based on district name
    let districtFilter = {};
    if (district) {
      const districtObj = await District.findOne({ districtName: district });
      if (districtObj) {
        // Filter groups by the found district ObjectId
        const groupIdsInDistrict = await Membersgroup.find({
          district: districtObj._id,
        }).select("_id");
        districtFilter = {
          group: { $in: groupIdsInDistrict.map((g) => g._id) },
        };
      }
    }

    // Determine the month filter; use current month if not specified
    let monthFilter = {};
    if (month) {
      monthFilter = { month: month };
    } else {
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
      });
      monthFilter = { month: currentMonth };
    }

    const aggregateQuery = [
      { $match: { ...monthFilter, ...districtFilter } },
      { $unwind: "$members" },
      {
        $group: {
          _id: { month: "$month", group: "$group" },
          totalAmount: {
            $sum: {
              $convert: {
                input: "$members.amountPaid",
                to: "decimal",
                onError: 0,
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "membersgroups",
          localField: "_id.group",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      { $unwind: "$groupDetails" },
      {
        $lookup: {
          from: "districts",
          localField: "groupDetails.district",
          foreignField: "_id",
          as: "districtDetails",
        },
      },
      { $unwind: "$districtDetails" },
      {
        $project: {
          month: "$_id.month",
          group: "$groupDetails.groupName",
          district: "$districtDetails.districtName",
          totalAmount: 1,
          count: 1,
        },
      },
    ];

    const oData = await Bithulmal.aggregate(aggregateQuery);

    // Assuming 'data' is the result from the aggregation query
    const data = oData.map((item) => ({
      ...item,
      totalAmount: item.totalAmount.toString(), // Convert Decimal128 to string
      count: item.count,
      month: item.month,
      group: item.group,
      district: item.district,
    }));
    res.json(data);
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
