const router = require("express").Router();
// Controllers
const {
  createDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  // getByFranchise,
} = require("../controllers/department");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/department", ["image"]),
    getS3Middleware(["image"]),
    createDepartment
  )
  .get(reqFilter, getDepartment)
  .put(
    getUploadMiddleware("uploads/department", ["image"]),
    getS3Middleware(["image"]),
    updateDepartment
  )
  .delete(deleteDepartment);

module.exports = router;
