const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");

// @desc      CREATE NEW BLOG
// @route     POST /api/v1/blog
// @access    protect
exports.createBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(200).json({
            success: true,
            message: "Blog created successfully",
            data: newBlog,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL BLOG
// @route     GET /api/v1/blog
// @access    public
exports.getBlog = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await Blog.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific blog",
                response,
            });
        }

        const query = searchkey
            ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
            : req.filter;

        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Blog.countDocuments(),
            parseInt(skip) === 0 && Blog.countDocuments(query),
            Blog.find(query)
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50)
                .sort({ _id: -1 }),
        ]);

        res.status(200).json({
            success: true,
            message: `Retrieved all blog`,
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

// @desc      UPDATE SPECIFIC BLOG
// @route     PUT /api/v1/blog/:id
// @access    protect
exports.updateBlog = async (req, res) => {
    try {
        const blogs = await Blog.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blogs,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      DELETE SPECIFIC BLOG
// @route     DELETE /api/v1/blog/:id
// @access    protect
exports.deleteBlog = async (req, res) => {
    try {
        const blogs = await Blog.findByIdAndDelete(req.query.id);

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
