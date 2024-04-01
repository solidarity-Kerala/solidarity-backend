const { default: mongoose } = require("mongoose");
const Permisssions = require("../models/permissions");

// @desc      CREATE NEW PERMISSIONS
// @route     POST /api/v1/permissions
// @access    protect
exports.createPermisssions = async (req, res) => {
    try {
        const newPermisssions = await Permisssions.create(req.body);
        res.status(200).json({
            success: true,
            message: "Permisssions created successfully",
            data: newPermisssions,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL PERMISSIONS
// @route     GET /api/v1/permissions
// @access    public
exports.getPermisssions = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await Permisssions.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific permissions",
                response,
            });
        }
        const query = searchkey
            ? { ...req.filter, androidReviewVersionNumber: { $regex: searchkey, $options: "i" } }
            : req.filter;
        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Permisssions.countDocuments(),
            parseInt(skip) === 0 && Permisssions.countDocuments(query),
            Permisssions.find(query)
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 0)
                .sort({ _id: -1 }),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all permissions`,
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


// @desc      UPDATE SPECIFIC PERMISSIONS
// @route     PUT /api/v1/permissions/:id
// @access    protect
exports.updatePermisssions = async (req, res) => {
    try {
        const permission = await Permisssions.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permisssions not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Permisssions updated successfully",
            data: permission,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};

// @desc      DELETE SPECIFIC PERMISSIONS
// @route     DELETE /api/v1/permissions/:id
// @access    protect
exports.deletePermisssions = async (req, res) => {
    try {
        const permission = await Permisssions.findByIdAndDelete(req.query.id);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permisssions not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Permisssions deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};

exports.select = async (req, res) => {
    try {
        const items = await Permisssions.find(
            {},
            { _id: 0, id: "$_id", value: "$androidReviewVersionNumber" }
        );
        return res.status(200).send(items);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};
