const { default: mongoose } = require("mongoose");
const News = require("../models/News");

// @desc      CREATE NEW NEWS
// @route     POST /api/v1/news
// @access    private
exports.createNews = async (req, res) => {
    try {
        const newNews = await News.create(req.body);
        res.status(200).json({
            success: true,
            message: "News created successfully",
            data: newNews,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// @desc      GET NEWS
// @route     GET /api/v1/news/:id
// @access    private
exports.getNews = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await News.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific news`,
                response,
            });
        }
        const query = {
            ...req.filter,
            ...(searchkey && {
                $or: [{ title: { $regex: searchkey, $options: "i" } }],
            }),
        };
        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && News.countDocuments(),
            parseInt(skip) === 0 && News.countDocuments(query),
            News.find(query)
                // .populate("franchise")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all news`,
            response: data,
            count: data.length,
            totalCount: totalCount || 0,
            filterCount: filterCount || 0,
        });
    } catch (err) {
        console.log(err);
        res.status(204).json({
            success: false,
            message: err.toString(),
        });
    }
};

// @desc      UPDATE SPECIFIC NEWS
// @route     PUT /api/v1/news/:id
// @access    private
exports.updateNews = async (req, res) => {
    try {
        const response = await News.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific news",
            enrollment: response,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};

// @desc      DELETE SPECIFIC NEWS
// @route     DELETE /api/v1/news/:id
// @access    private
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.query.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "News deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
