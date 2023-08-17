const router = require("express").Router();
// controllers
const {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
  select,
  getMembersByArea,
  getMembersByMemberGroup,
} = require("../controllers/members");

// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createMember)
  .get(reqFilter, getMembers)
  .put(updateMember)
  .delete(deleteMember);
router.get("/select", reqFilter, select);

// // New URL to get members by area
// router.get("/area/:areaId", getMembersByArea);

// New URL to get members by area
router.get("/area", getMembersByArea);

router.get("/member-by-membergroup", getMembersByMemberGroup);

module.exports = router;
