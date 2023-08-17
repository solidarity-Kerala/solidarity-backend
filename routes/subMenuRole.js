const router = require("express").Router();
//controllers
const {
  addSubMenuRole,
  getSubMenuRole,
  updateSubMenuRole,
  deleteSubMenuRole,
} = require("../controllers/subMenuRole");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(addSubMenuRole)
  .get(reqFilter, getSubMenuRole)
  .put(updateSubMenuRole)
  .delete(deleteSubMenuRole);

module.exports = router;
