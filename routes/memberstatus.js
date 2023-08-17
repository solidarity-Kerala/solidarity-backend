const router = require("express").Router();
// controllers
const {
  createMemberStatus,
  getMembersStatus,
  updateMemberStatus,
  deleteMemberStatus,
  select,
} = require("../controllers/memberstatus");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createMemberStatus)
  .get(reqFilter, getMembersStatus)
  .put(updateMemberStatus)
  .delete(deleteMemberStatus);

router.get("/select", reqFilter, select);

module.exports = router;
