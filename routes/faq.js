const router = require("express").Router();
// Controllers
const {
  createFaq,
  getFaq,
  updateFaq,
  deleteFaq,
  getByFranchise,
} = require("../controllers/faq");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createFaq)
  .get(reqFilter, getFaq)
  .put(updateFaq)
  .delete(deleteFaq);

router.get("/get-by-faq", getByFranchise);

module.exports = router;
