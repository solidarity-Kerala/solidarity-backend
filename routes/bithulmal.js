const router = require("express").Router();
// controllers
const {
  createBithulmal,
  getBithulmals,
  updateBithulmal,
  deleteBithulmal,
  getBithulmalReport,
  getBithulmalReportByMemberGroup,
  getAmountPaidByMemberInMemberGroup,
  sumBithumalAmount,
  getBithulmalByMemberGroupId,
  getMemberBithulmal,
} = require("../controllers/bithulmal");
// middleware
const { protect } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createBithulmal)
  .get(reqFilter, getBithulmals)
  .put(updateBithulmal)
  .delete(deleteBithulmal);

// Get Bithulmal report with total amounts for each month
router.get("/report", getBithulmalReport);

// Get Bithulmal report with total amounts by member group
router.get("/baithulmal-by-member", getMemberBithulmal);
router.get("/report/member-group", getBithulmalReportByMemberGroup);
router.get("/amount-by-member-in-group", getAmountPaidByMemberInMemberGroup);
router.get("/sum-bithulmal-amount", sumBithumalAmount);
router.get("/bithulmal-membergroup", reqFilter, getBithulmalByMemberGroupId);

module.exports = router;
