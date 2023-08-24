const { default: mongoose } = require("mongoose");
const AdministrativeCouncil = require("../models/administrativeCouncil");

// @desc      CREATE NEW ADMINISTRATIVE COUNCIL
// @route     POST /api/v1/administrative-council
// @access    private
exports.createAdministrativeCouncil = async (req, res) => {
    try {
        const newAdministrativeCouncil = await AdministrativeCouncil.create(req.body);
        res.status(200).json({
            success: true,
            message: "Administrative Council created successfully",
            data: newAdministrativeCouncil,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// @desc      GET ADMINISTRATIVE COUNCIL
// @route     GET /api/v1/administrative-council/:id
// @access    private
exports.getAdministrativeCouncil = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await AdministrativeCouncil.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific administrative council`,
                response,
            });
        }
        const query = {
            ...req.filter,
            ...(searchkey && {
                $or: [{ enName: { $regex: searchkey, $options: "i" } },
                { enDesignation: { $regex: searchkey, $options: "i" } }],
            }),
        };
        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && AdministrativeCouncil.countDocuments(),
            parseInt(skip) === 0 && AdministrativeCouncil.countDocuments(query),
            AdministrativeCouncil.find(query)
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all administrative council`,
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

// @desc      UPDATE SPECIFIC ADMINISTRATIVE COUNCIL
// @route     PUT /api/v1/administrative-council/:id
// @access    private
exports.updateAdministrativeCouncil = async (req, res) => {
    try {
        const response = await AdministrativeCouncil.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific administrative council",
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

// @desc      DELETE SPECIFIC ADMINISTRATIVE COUNCIL
// @route     DELETE /api/v1/administrative-council/:id
// @access    private
exports.deleteAdministrativeCouncil = async (req, res) => {
    try {
        const administrativeCouncil = await AdministrativeCouncil.findByIdAndDelete(req.query.id);

        if (!administrativeCouncil) {
            return res.status(404).json({
                success: false,
                message: "Administrative Council not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Administrative Council deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
