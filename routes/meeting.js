const router = require("express").Router();
// controllers
const {
  createMeeting,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  select,
  checkMeetingHeld,
} = require("../controllers/meeting");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createMeeting)
  .get(reqFilter, getMeeting)
  .put(updateMeeting)
  .delete(deleteMeeting);

router.get("/select", reqFilter, select);
router.get("/check-meeting", reqFilter, checkMeetingHeld);

module.exports = router;
