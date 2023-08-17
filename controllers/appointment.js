const { default: mongoose } = require("mongoose");
const Appointment = require("../models/Appointment");

// @desc      CREATE NEW APPOINTMENT
// @route     POST /api/v1/appointments
// @access    protect
exports.createAppointment = async (req, res) => {
  try {
    if (req.body.bookingDate) {
      const targetDate = new Date(req.body.bookingDate);
      const existingBooking = await Appointment.aggregate([
        {
          $match: {
            bookingDate: {
              $gte: new Date(targetDate.toISOString().split("T")[0]),
              $lt: new Date(
                targetDate.toISOString().split("T")[0] + "T23:59:59.999Z"
              ),
            },
          },
        },
      ]);
      req.body.bookingId = `DFMS-${existingBooking.length + 1 || 1}`;
    }

    const newAppointment = await Appointment.create({
      ...req.body,
      franchise: req.user?.franchise,
    });

    res.status(200).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ALL APPOINTMENT & APPOINTMENTs
// @route     GET /api/v1/appointments
// @access    protect
exports.getAppointment = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Appointment.findById(id)
        .populate("user")
        //   .populate("timeSlot")
        .populate("dietician");
      // .populate("subscriberMealPlanEntry");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific appointment list",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, bookingId: { $regex: searchkey, $options: "i" } }
      : req.filter;

    // const regex = new RegExp(searchkey, "i");
    // const userMatchesRegex = Object.values(data.user).some((value) =>
    //   regex.test(value)
    // );

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user._id;
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    } else if (req.user?.userType?.role === "Admin") {
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
    }

    if (startDate && endDate) {
      query.bookingDate = {
        $gte: startDate,
        $lte: endDate,
      };
      query.admissionType = "IN";
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      Appointment.find(query)
        .sort({ _id: -1 })
        .populate("user")
        .populate("bookingSlot")
        .populate("dietician")
        // .populate("subscriberMealPlanEntry")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10),
    ]);

    console.log(data);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
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

// @desc      UPDATE SPECIFIC APPOINTMENT
// @route     PUT /api/v1/appointments/:id
// @access    protect
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC APPOINTMENT
// @route     DELETE /api/v1/appointments/:id
// @access    protect
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.query.id, {
      new: true,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      FILTER APPOINTMENT
// @route     GET /api/v1/appointment/filter
// @access    protect
exports.filterAppointment = async (req, res) => {
  try {
    const { date, user, bookingSlot, bookingId } = req.query;
    const filters = {};

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filters.bookingDate = { $gte: startDate, $lt: endDate };
    }

    // Filter by user
    if (user) {
      filters["user"] = user;
    }

    // Filter by booking slot
    if (bookingSlot) {
      filters.appointmentStatus = bookingSlot;
    }

    // Filter by booking ID
    if (bookingId) {
      filters.bookingId = bookingId;
    }
    const appointments = await Appointment.find(filters).populate(
      "user dietician"
    );
    // .populate("user")
    // .populate("dietician")
    // .populate("subscriberMealPlanEntry");
    // .populate("bookingSlot");

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
        filters,
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      date: appointments,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ACTIVE APPOINTMENT & APPOINTMENTs
// @route     GET /api/v1/appointments/active
// @access    protect
exports.activeAdmission = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Appointment.findById(id)
        .populate("user")
        //   .populate("timeSlot")
        .populate("dietician");
      // .populate("subscriberMealPlanEntry");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific appointment list",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, bookingId: { $regex: searchkey, $options: "i" } }
      : req.filter;

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user._id;
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    } else if (req.user?.userType?.role === "Admin") {
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    }

    if (startDate && endDate) {
      query.admissionDate = {
        $gte: startDate,
        $lte: endDate,
      };
      query.admissionType = "IN";
    } else {
      query.bookingDate = {
        $gte: startDate,
        $lte: endDate,
      };
      query.admissionType = "IN";
    }
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      // Appointment.find({ ...query })
      Appointment.find(query)
        .sort({ _id: -1 })
        .populate("user")
        .populate("bookingSlot")
        .populate("dietician")
        // .populate("subscriberMealPlanEntry")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
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
