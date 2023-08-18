const router = require("express").Router();
// controllers
const {
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  select,
} = require("../controllers/admin");

// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAdmin)
  .get(reqFilter, getAdmin)
  .put(updateAdmin)
  .delete(deleteAdmin);
router.get("/select", reqFilter, select);

module.exports = router;
