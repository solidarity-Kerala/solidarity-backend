const router = require("express").Router();
// Controllers
const {
    createFaculties,
    getFaculties,
    updateFaculties,
    deleteFaculties,
    // getByFranchise,
} = require("../controllers/faculties");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/faculties", ["image"]),
        getS3Middleware(["image"]),
        createFaculties
    )
    .get(reqFilter, getFaculties)
    .put(
        getUploadMiddleware("uploads/faculties", ["image"]),
        getS3Middleware(["image"]), updateFaculties
    )
    .delete(deleteFaculties);

// router.get("/get-by-boardof-director", getByFranchise);

module.exports = router;
