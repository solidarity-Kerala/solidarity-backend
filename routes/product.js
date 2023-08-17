const router = require("express").Router();
// Controllers
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/product", ["image"]),
    getS3Middleware(["image"]),
    createProduct
  )
  .get(reqFilter, getProducts)
  .put(
    getUploadMiddleware("uploads/product", ["image"]),
    getS3Middleware(["image"]),
    updateProduct
  )
  .delete(deleteProduct);

module.exports = router;
