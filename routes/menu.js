const router = require("express").Router();
// controllers
const {
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(addMenu)
  .get(reqFilter, getMenu)
  .put(updateMenu)
  .delete(deleteMenu);

module.exports = router;
