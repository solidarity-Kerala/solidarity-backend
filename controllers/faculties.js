const { default: mongoose } = require("mongoose");
const Faculties = require("../models/Faculties");

// @desc      CREATE NEW FACULTIES
// @route     POST /api/v1/faculties
// @access    private
exports.createFaculties = async (req, res) => {
    try {
        const newFaculties = await Faculties.create(req.body);
        res.status(200).json({
            success: true,
            message: "Faculties created successfully",
            data: newFaculties,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// @desc      GET FACULTIES
// @route     GET /api/v1/faculties/:id
// @access    private
exports.getFaculties = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await Faculties.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific faculties`,
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
            parseInt(skip) === 0 && Faculties.countDocuments(),
            parseInt(skip) === 0 && Faculties.countDocuments(query),
            Faculties.find(query)
                // .populate("franchise")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all faculties`,
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

// @desc      UPDATE SPECIFIC FACULTIES
// @route     PUT /api/v1/faculties/:id
// @access    private
exports.updateFaculties = async (req, res) => {
    try {
        const response = await Faculties.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific faculties",
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

// @desc      DELETE SPECIFIC FACULTIES
// @route     DELETE /api/v1/faculties/:id
// @access    private
exports.deleteFaculties = async (req, res) => {
    try {
        const faculties = await Faculties.findByIdAndDelete(req.query.id);

        if (!faculties) {
            return res.status(404).json({
                success: false,
                message: "Faculties not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Faculties deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET BY FRANCHISE
// @route     GET /api/v1/boardof-director/get-by-boardof-director
// @access    private
// exports.getByFranchise = async (req, res) => {
//     try {
//         const { id } = req.query;
//         const response = await BoardOfDirector.find({ franchise: id });

//         res.status(201).json({
//             message: "Successfully retrieved",
//             data: response,
//         });
//     } catch (err) {
//         console.log("Error:", err);
//         res.status(500).json({
//             error: "Internal server error",
//             success: false,
//         });
//     }
// };
