const router = require("express").Router();
// Controllers
const {
    createNews,
    getNews,
    updateNews,
    deleteNews,
    // getByFranchise,
} = require("../controllers/news");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/news", ["image"]),
        getS3Middleware(["image"]),
        createNews
    )
    .get(reqFilter, getNews)
    .put(
        getUploadMiddleware("uploads/news", ["image"]),
        getS3Middleware(["image"]), updateNews
    )
    .delete(deleteNews);

// router.get("/get-by-boardof-director", getByFranchise);

module.exports = router;
