const router = require("express").Router();
// Controllers
const {
  createDownload,
  getDownload,
  updateDownload,
  deleteDownload,
  select,
} = require("../controllers/download");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createDownload)
  .get(reqFilter, getDownload)
  .put(updateDownload)
  .delete(deleteDownload);

router.get("/select", reqFilter, select);

module.exports = router;
