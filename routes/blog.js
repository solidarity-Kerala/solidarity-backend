const router = require("express").Router();
// Controllers
const {
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  // getByFranchise,
} = require("../controllers/blog");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/blog", ["image"]),
    getS3Middleware(["image"]),
    createBlog
  )
  .get(reqFilter, getBlog)
  .put(
    getUploadMiddleware("uploads/blog", ["image"]),
    getS3Middleware(["image"]), updateBlog
  )
  .delete(deleteBlog);

module.exports = router;
