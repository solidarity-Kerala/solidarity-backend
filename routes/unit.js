const router = require("express").Router();
// controllers
const {
  createUnit,
  getUnit,
  updateUnit,
  deleteUnit,
} =  require("../controllers/unit");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createUnit)
  .get(reqFilter, getUnit)
  .put(updateUnit)
  .delete(deleteUnit);

module.exports = router;
