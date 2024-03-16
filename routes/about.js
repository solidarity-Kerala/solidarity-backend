const router = require("express").Router();
const {
  createAbout,
  getAbouts,
  updateAbout,
  deleteAbout,
  select,
} = require("../controllers/about");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAbout)
  .get(reqFilter, getAbouts)
  .put(updateAbout)
  .delete(deleteAbout);

router.get("/select", reqFilter, select);

module.exports = router;
