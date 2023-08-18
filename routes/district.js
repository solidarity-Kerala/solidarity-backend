const router = require("express").Router();
// controllers
const {
  createDistrict,
  getDistricts,
  updateDistrict,
  deleteDistrict,
  select,
} = require("../controllers/district");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createDistrict)
  .get(reqFilter, getDistricts)
  .put(updateDistrict)
  .delete(deleteDistrict);

router.get("/select", reqFilter, select);

module.exports = router;
