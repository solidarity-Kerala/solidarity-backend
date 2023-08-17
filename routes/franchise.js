const router = require("express").Router();
// Controllers
const {
  createFranchise,
  getFranchise,
  updateFranchise,
  deleteFranchise,
  select,
} = require("../controllers/franchise");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createFranchise)
  .get(reqFilter, getFranchise)
  .put(updateFranchise)
  .delete(deleteFranchise);

router.get("/select", reqFilter, select);

module.exports = router;
