const router = require("express").Router();
// Controllers
const {
  createBoardOfDirector,
  getBoardOfDirector,
  updateBoardOfDirector,
  deleteBoardOfDirector,
} = require("../controllers/boardOfDirector");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/boardofdirector", ["image"]),
    getS3Middleware(["image"]),
    createBoardOfDirector
  )
  .get(reqFilter, getBoardOfDirector)
  .put(
    getUploadMiddleware("uploads/boardofdirector", ["image"]),
    getS3Middleware(["image"]), updateBoardOfDirector
  )
  .delete(deleteBoardOfDirector);

module.exports = router;
