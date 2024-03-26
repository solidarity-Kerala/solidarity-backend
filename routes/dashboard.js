const router = require("express").Router();
//controllers
const { count, report } = require("../controllers/dashboard");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").get(reqFilter, count);
// router.route("/dietitian").get(protect, reqFilter, patientCount);
router.route("/report").get(protect, reqFilter, report);

module.exports = router;
