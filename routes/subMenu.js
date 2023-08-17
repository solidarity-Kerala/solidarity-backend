const router = require("express").Router();
// controllers
const {
    addSubMenu,
    getSubMenu,
    updateSubMenu,
    deleteSubMenu,
} = require("../controllers/subMenu");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
    .route("/")
    .post(addSubMenu)
    .get(reqFilter, getSubMenu)
    .put(updateSubMenu)
    .delete(deleteSubMenu);

module.exports = router;
