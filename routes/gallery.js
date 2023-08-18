const router = require("express").Router();
// Controllers
const {
    createGallery,
    getGallery,
    updateGallery,
    deleteGallery,
    // getByFranchise,
} = require("../controllers/gallery");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/gallery", ["image"]),
        getS3Middleware(["image"]),
        createGallery
    )
    .get(reqFilter, getGallery)
    .put(
        getUploadMiddleware("uploads/gallery", ["image"]),
        getS3Middleware(["image"]), updateGallery
    )
    .delete(deleteGallery);

module.exports = router;
