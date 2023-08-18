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

router
    .route("/")
    .post(createNotification)
    .get(reqFilter, getNotification)
    .put(updateNotification)
    .delete(deleteNotification);

module.exports = router;
