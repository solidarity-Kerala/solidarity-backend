const router = require("express").Router();
// Controllers
const {
    createNotification,
    getNotification,
    updateNotification,
    deleteNotification,
} = require("../controllers/notification");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(getUploadMiddleware("uploads/notification", ["image"]),
    getS3Middleware(["image"]),createNotification)
    .get(reqFilter, getNotification)
    .put(getUploadMiddleware("uploads/notification", ["image"]),
    getS3Middleware(["image"]),updateNotification)
    .delete(deleteNotification);

module.exports = router;
