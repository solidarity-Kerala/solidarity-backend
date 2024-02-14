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
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/download", ["document"]),
    getS3Middleware(["document"]),
    createDownload
  )
  .get(reqFilter, getDownload)
  .put(
    getUploadMiddleware("uploads/download", ["document"]),
    getS3Middleware(["document"]),
    updateDownload
  )
  .delete(deleteDownload);

router.get("/select", reqFilter, select);

module.exports = router;
