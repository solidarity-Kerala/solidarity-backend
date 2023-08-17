const router = require("express").Router();
//
const { login, getMe, register, adminLogin } = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);
router.post("/admin-login", adminLogin);

router.get("/get-me", protect, getMe);

module.exports = router;
