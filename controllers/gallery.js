const { default: mongoose } = require("mongoose");
const Gallery = require("../models/gallery");

// @desc      CREATE NEW GALLERY
// @route     POST /api/v1/gallery
// @access    protect
exports.createGallery = async (req, res) => {
    try {
        const newGallery = await Gallery.create(req.body);
        res.status(200).json({
            success: true,
            message: "Gallery created successfully",
            data: newGallery,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL GALLERY
// @route     GET /api/v1/gallery
// @access    public
exports.getGallery = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await Gallery.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific gallery",
                response,
            });
        }

        const query = searchkey
            ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
            : req.filter;

        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Gallery.countDocuments(),
            parseInt(skip) === 0 && Gallery.countDocuments(query),
            Gallery.find(query)
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50)
                .sort({ _id: -1 }),
        ]);

        res.status(200).json({
            success: true,
            message: `Retrieved all gallery`,
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

// @desc      UPDATE SPECIFIC GALLERY
// @route     PUT /api/v1/gallery/:id
// @access    protect
exports.updateGallery = async (req, res) => {
    try {
        const gallerys = await Gallery.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });

        if (!gallerys) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Gallery updated successfully",
            data: gallerys,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      DELETE SPECIFIC GALLERY
// @route     DELETE /api/v1/gallery/:id
// @access    protect
exports.deleteGallery = async (req, res) => {
    try {
        const gallerys = await Gallery.findByIdAndDelete(req.query.id);

        if (!gallerys) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Gallery deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
