const { default: mongoose } = require("mongoose");
const ProductDetails = require("../models/productDetails");

// @desc      CREATE NEW PRODUCT DETAILS
// @route     POST /api/v1/product-details
// @access    protect
exports.createProductDetails = async (req, res) => {
  try {
    const newProductDetails = await ProductDetails.create(req.body);
    res.status(200).json({
      success: true,
      message: "Product details created successfully",
      data: newProductDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ALL PRODUCT DETAILS
// @route     GET /api/v1/product-details
// @access    public
exports.getProductDetails = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const productDetails = await ProductDetails.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific product details",
        response: productDetails,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ProductDetails.countDocuments(),
      parseInt(skip) === 0 && ProductDetails.countDocuments(query),
      ProductDetails.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all product details",
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC PRODUCT DETAILS
// @route     PUT /api/v1/product-details/:id
// @access    protect
exports.updateProductDetails = async (req, res) => {
  try {
    const productDetails = await ProductDetails.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Product details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product details updated successfully",
      data: productDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC PRODUCT DETAILS
// @route     DELETE /api/v1/product-details/:id
// @access    protect
exports.deleteProductDetails = async (req, res) => {
  try {
    const productDetails = await ProductDetails.findByIdAndDelete(req.query.id);

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Product details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product details deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
