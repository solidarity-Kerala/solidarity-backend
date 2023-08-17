const router = require("express").Router();
// Controllers
const {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  filterAppointment,
  activeAdmission,
  // updateDischarge,
} = require("../controllers/appointment");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(protect, createAppointment)
  .get(reqFilter, protect, getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.get("/filter", protect, filterAppointment);
router
  .route("/active")
  .post(createAppointment)
  .get(protect, reqFilter, activeAdmission)
  .put(updateAppointment)
  .delete(deleteAppointment);

// router.post("/update", protect, updateDischarge);

module.exports = router;
