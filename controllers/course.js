const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");

// @desc      CREATE NEW COURSE
// @route     POST /api/v1/course
// @access    protect
exports.createCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL COURSE
// @route     GET /api/v1/course
// @access    public
exports.getCourse = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await Course.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific Course",
                response,
            });
        }

        const query = searchkey
            ? { ...req.filter, courseName: { $regex: searchkey, $options: "i" } }
            : req.filter;

        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Course.countDocuments(),
            parseInt(skip) === 0 && Course.countDocuments(query),
            Course.find(query)
                // .populate("category")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50)
                .sort({ _id: -1 }),
        ]);

        res.status(200).json({
            success: true,
            message: `Retrieved all course`,
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

// @desc      UPDATE SPECIFIC COURSE
// @route     PUT /api/v1/course/:id
// @access    protect
exports.updateCourse = async (req, res) => {
    try {
        const courses = await Course.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });

        if (!courses) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: courses,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      DELETE SPECIFIC COURSE
// @route     DELETE /api/v1/course/:id
// @access    protect
exports.deleteCourse = async (req, res) => {
    try {
        const courses = await Course.findByIdAndDelete(req.query.id);

        if (!courses) {
            return res.status(404).json({
                success: false,
                message: "FranchiCoursese not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET BY CATEGORY
// @route     GET /api/v1/course/getcourse-by-category
// @access    private
exports.getCourseByCategory = async (req, res) => {
    try {
        const { key } = req.query;
        const response = await Course.find({ category: key });

        res.status(201).json({
            message: "Successfully retrieved",
            data: response,
        });

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({
            error: "Internal server error",
            success: false,
        });
    }
};