const router = require("express").Router();
// controllers
const {
  addUserType,
  select,
  updateUserType,
  deleteUserType,
  getUserType,
} = require("../controllers/userType");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(addUserType)
  .get(reqFilter, getUserType)
  .put(updateUserType)
  .delete(deleteUserType);

router.route("/select").get(reqFilter, select);

router.get("/get-user-types", getUserType);

module.exports = router;
