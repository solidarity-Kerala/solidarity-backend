const router = require("express").Router();
// controllers
const {
  addUser,
  getUser,
  updateUser,
  updateUserField,
  deleteUser,
  filterUser,
  select,
} = require("../controllers/user");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
//image handling
const { getS3Middleware } = require("../middleware/s3client");

const getUploadMiddleware = require("../middleware/upload");
// file upload settings

router
  .route("/")
  .post(
    protect,
    getUploadMiddleware("public/dfms/uploads/user", ["userImage"]),
    getS3Middleware(["userImage"]),
    addUser
  )
  .get(reqFilter, protect, getUser)
  .put(
    protect,
    getUploadMiddleware("public/dfms/uploads/user", ["userImage"]),
    getS3Middleware(["userImage"]),
    updateUser
  )
  .delete(protect, deleteUser);

router.patch("/update-user-field", updateUserField);
router.get("/filter-user", filterUser);
router.get("/select", reqFilter, protect, select);

module.exports = router;
