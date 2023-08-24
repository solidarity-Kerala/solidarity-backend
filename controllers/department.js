const { default: mongoose } = require("mongoose");
const Department = require("../models/department");

// @desc      CREATE NEW DEPARTMENT
// @route     POST /api/v1/department
// @access    protect
exports.createDepartment = async (req, res) => {
    try {
        const newDepartment = await Department.create(req.body);
        res.status(200).json({
            success: true,
            message: "Department created successfully",
            data: newDepartment,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL DEPARTMENT
// @route     GET /api/v1/department
// @access    public
exports.getDepartment = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await Department.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific department",
                response,
            });
        }

        const query = searchkey
            ? { ...req.filter, courseName: { $regex: searchkey, $options: "i" } }
            : req.filter;

        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Department.countDocuments(),
            parseInt(skip) === 0 && Department.countDocuments(query),
            Department.find(query)
                // .populate("category")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50)
                .sort({ _id: -1 }),
        ]);

        res.status(200).json({
            success: true,
            message: `Retrieved all department`,
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

// @desc      UPDATE SPECIFIC DEPARTMENT
// @route     PUT /api/v1/department/:id
// @access    protect
exports.updateDepartment = async (req, res) => {
    try {
        const departments = await Department.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });

        if (!departments) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: departments,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      DELETE SPECIFIC DEPARTMENT
// @route     DELETE /api/v1/department/:id
// @access    protect
exports.deleteDepartment = async (req, res) => {
    try {
        const departments = await Department.findByIdAndDelete(req.query.id);

        if (!departments) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
