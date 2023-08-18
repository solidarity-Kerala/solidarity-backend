const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");

// @desc      CREATE NEW PRODUCT
// @route     POST /api/v1/product
// @access    protect
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ALL PRODUCTS
// @route     GET /api/v1/product
// @access    public
exports.getProducts = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const product = await Product.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific product",
        response: product,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Product.countDocuments(),
      parseInt(skip) === 0 && Product.countDocuments(query),
      Product.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all products",
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

// @desc      UPDATE SPECIFIC PRODUCT
// @route     PUT /api/v1/product/:id
// @access    protect
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC PRODUCT
// @route     DELETE /api/v1/product/:id
// @access    protect
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.query.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
