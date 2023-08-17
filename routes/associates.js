const router = require("express").Router();
// controllers
const {
  createAssociates,
  getAssociates,
  updateAssociates,
  deleteAssociates,
  select,
  getAssociatesByMemberGroup,
} = require("../controllers/associates");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAssociates)
  .get(reqFilter, getAssociates)
  .put(updateAssociates)
  .delete(deleteAssociates);
router.get("/select", reqFilter, select);

router.get("/associates-By-MemberGroup", getAssociatesByMemberGroup);

module.exports = router;
