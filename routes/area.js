// routes/areaRoutes.js
const router = require("express").Router();
// controllers
const {
  createArea,
  getAreas,
  updateArea,
  deleteArea,
  select,
} = require("../controllers/area");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createArea)
  .get(reqFilter, getAreas)
  .put(updateArea)
  .delete(deleteArea);

router.get("/select", reqFilter, select);

module.exports = router;
