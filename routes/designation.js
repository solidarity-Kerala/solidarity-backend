// routes/areaRoutes.js
const router = require("express").Router();
// controllers
const {
  createDesignation,
  getDesignation,
  updateDesignation,
  deleteDesignation,
  select,
} = require("../controllers/designation");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createDesignation)
  .get(reqFilter, getDesignation)
  .put(updateDesignation)
  .delete(deleteDesignation);

router.get("/select", reqFilter, select);

module.exports = router;
