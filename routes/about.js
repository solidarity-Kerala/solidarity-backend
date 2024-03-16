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
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/about", ["image"]),
    getS3Middleware(["image"]),
    createAbout
  )
  .get(reqFilter, getAbouts)
  .put(
    getUploadMiddleware("uploads/about", ["image"]),
    getS3Middleware(["image"]),
    updateAbout
  )
  .delete(deleteAbout);

router.get("/select", reqFilter, select);

module.exports = router;
