const router = require("express").Router();
// Controllers
const {
    createAdministrativeCouncil,
    getAdministrativeCouncil,
    updateAdministrativeCouncil,
    deleteAdministrativeCouncil,
    // getByFranchise,
} = require("../controllers/administrativeCouncil");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/administrativecouncil", ["image"]),
        getS3Middleware(["image"]),
        createAdministrativeCouncil
    )
    .get(reqFilter, getAdministrativeCouncil)
    .put(
        getUploadMiddleware("uploads/administrativecouncil", ["image"]),
        getS3Middleware(["image"]), updateAdministrativeCouncil
    )
    .delete(deleteAdministrativeCouncil);

// router.get("/get-by-boardof-director", getByFranchise);

module.exports = router;
