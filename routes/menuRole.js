const router = require("express").Router();
//controllers
const {
  addMenuRole,
  getMenuRole,
  updateMenuRole,
  deleteMenuRole,
} = require("../controllers/menuRole");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(addMenuRole)
  .get(reqFilter,protect, getMenuRole)
  .put(updateMenuRole)
  .delete(deleteMenuRole);

module.exports = router;
