const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Area = require("../models/Area");
const Attendance = require("../models/Attendance");
const Bithulmal = require("../models/Bithulmal");
const District = require("../models/District");
const Members = require("../models/Members");
const Membersgroup = require("../models/Membersgroup");
const Associates = require("../models/Associates");
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
      associatesCount,
    ] = await Promise.all([
      // User.countDocuments({ userType: "6471b34d9fb2b29fe0458878" }),
      // User.countDocuments({ userType: "6471b3849fb2b29fe045887b" }),
      // User.countDocuments({ userType: "64815bde89e0a44fc31c53b0" }),
      Area.countDocuments(),
      Attendance.countDocuments(),
      Bithulmal.countDocuments(),
      District.countDocuments(),
      Members.countDocuments(),
      Membersgroup.countDocuments(),
      Associates.countDocuments(),
    ]);
    console.log("count", areaCount);

    // const targetDate = new Date();
    // const startOfDay = moment(targetDate).startOf("day").toDate();
    // const endOfDay = moment(targetDate).endOf("day").toDate();
    // const existingBookingCount = await Appointment.countDocuments({
    //   bookingDate: {
    //     $gte: startOfDay,
    //     $lt: endOfDay,
    //   },
    // });

    res.status(200).json([
      {
        count: attendanceCount,
        title: "Attendance Count",
        icon: "Attendance",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: areaCount,
        title: "Area Count",
        icon: "area",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: bithulmalCount,
        title: "Bithulmal Count",
        icon: "bithulmal",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: districtCount,
        title: "District Count",
        icon: "District",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: memberCount,
        title: "Member Count",
        icon: "member",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: memberGroupCount,
        title: "Member Group Count",
        icon: "memberGroup",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      {
        count: associatesCount,
        title: "Associates Count",
        icon: "associate",
        background: "#ebf1fb",
        color: "#5753cd",
      },
      // {
      //   count: patientCount,
      //   title: "Patients",
      //   icon: "patient",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
      // {
      //   count: deliveryManCount,
      //   title: "Delivery Man",
      //   icon: "deliveryMan",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
      // {
      //   count: existingBookingCount,
      //   title: "Booking Count",
      //   icon: "booking",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
      // {
      //   count: dieticianCount,
      //   title: "Dieticians",
      //   icon: "dietician",
      //   background: "#fbe2f0",
      //   color: "rgb(252 121 127)",
      // },
      // {
      //   count: patientCount,
      //   title: "Patients",
      //   icon: "patient",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
      // {
      //   count: deliveryManCount,
      //   title: "Delivery Man",
      //   icon: "deliveryMan",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
      // {
      //   count: existingBookingCount,
      //   title: "Booking Count",
      //   icon: "booking",
      //   background: "#ebf1fb",
      //   color: "#5753cd",
      // },
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
