const router = require("express").Router();
// controllers
const {
  createMembersGroup,
  getMembersGroups,
  updateMembersGroup,
  deleteMembersGroup,
  select,
} = require("../controllers/membersGroup");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createMembersGroup)
  .get(reqFilter, getMembersGroups)
  .put(updateMembersGroup)
  .delete(deleteMembersGroup);

router.get("/select", reqFilter, select);

module.exports = router;
