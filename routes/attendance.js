// routes/attendanceRoutes.js
const router = require("express").Router();
// controllers
const {
  createAttendance,
  getAttendances,
  updateAttendance,
  deleteAttendance,
  getAttendanceReportByMemberGroup,
  getAttendanceReportByMonth,
  getAttendanceByMember,
  getPresentAbsentMembersByMonth,
  getPresentAbsentMembersByMonthwithcount,
  getAttendanceByGroup,
  getMemberAttendance,
} = require("../controllers/attendance");
// middleware
const { protect } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAttendance)
  .get(reqFilter, getAttendances)
  .put(updateAttendance)
  .delete(deleteAttendance);

router.get("/report/member-group", getAttendanceReportByMemberGroup);
router.get("/report/month", getAttendanceReportByMonth);
router.get("/attendance-by-member", getMemberAttendance);
router.get("/present-absent-members", getPresentAbsentMembersByMonth);
router.get(
  "/present-absent-members-count",
  reqFilter,
  getPresentAbsentMembersByMonthwithcount
);
router.get("/by-group", reqFilter, getAttendanceByGroup);

module.exports = router;
