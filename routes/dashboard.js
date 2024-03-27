const router = require("express").Router();
//controllers
const { count, report, members } = require("../controllers/dashboard");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").get(reqFilter, count);
// router.route("/dietitian").get(protect, reqFilter, patientCount);
router.route("/report").get(protect, reqFilter, report);
router.route("/members").get(protect, reqFilter, members);

module.exports = router;
