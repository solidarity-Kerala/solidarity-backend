const router = require("express").Router();
// Controllers
const {
    createPermisssions,
    getPermisssions,
    updatePermisssions,
    deletePermisssions,
} = require("../controllers/permissions");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
    .route("/")
    .post(createPermisssions)
    .get(reqFilter, getPermisssions)
    .put(updatePermisssions)
    .delete(deletePermisssions);

module.exports = router;
