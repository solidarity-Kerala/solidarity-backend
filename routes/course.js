const router = require("express").Router();
// Controllers
const {
    createCourse,
    getCourse,
    updateCourse,
    deleteCourse,
    getCourseByCategory,
} = require("../controllers/course");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/course", ["image"]),
        getS3Middleware(["image"]),
        createCourse
    )
    .get(reqFilter, getCourse)
    .put(
        getUploadMiddleware("uploads/course", ["image"]),
        getS3Middleware(["image"]), updateCourse
    )
    .delete(deleteCourse);

router.get("/getcourse-by-category", reqFilter, getCourseByCategory);
module.exports = router;
