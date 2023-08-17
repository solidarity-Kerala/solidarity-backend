const router = require("express").Router();
// Controllers
const {
  createProductDetails,
  getProductDetails,
  updateProductDetails,
  deleteProductDetails,
} = require("../controllers/productDetails");

// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/productDetails", [
      "image1",
      "image2",
      "image3",
    ]),
    getS3Middleware(["image1", "image2", "image3"]),
    createProductDetails
  )
  .get(reqFilter, getProductDetails)
  .put(
    getUploadMiddleware("uploads/productDetails", [
      "image1",
      "image2",
      "image3",
    ]),
    getS3Middleware(["image1", "image2", "image3"]),
    updateProductDetails
  )
  .delete(deleteProductDetails);

module.exports = router;
