const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");

// @desc      CREATE NOTIFICATION
// @route     POST /api/v1/notification
// @access    private
exports.createNotification = async (req, res) => {
    try {
        const response = await Notification.create(req.body);
        res.status(200).json({
            success: true,
            message: "Successfully added notification",
            response,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};

// @desc      GET NOTIFICATION
// @route     GET /api/v1/notification
// @access    private
exports.getNotification = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;
        if (id && mongoose.isValidObjectId(id)) {
            const response = await Notification.findById(id);
            return res.status(200).json({
                success: true,
                message: `Retrieved specific notification`,
                response,
            });
        }
        const query = searchkey
            ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
            : req.filter;
        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Notification.countDocuments(),
            parseInt(skip) === 0 && Notification.countDocuments(query),
            Notification.find(query)
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 50),
        ]);
        res.status(200).json({
            success: true,
            message: `Retrieved all notification`,
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

// @desc      UPDATE NOTIFICATION
// @route     PUT /api/v1/notification
// @access    private
exports.updateNotification = async (req, res) => {
    try {
        const response = await Notification.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated specific notification",
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

// @desc      DELETE NOTIFICATION
// @route     DELETE /api/v1/notification
// @access    private
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.query.id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
