const { default: mongoose } = require("mongoose");
const BoardOfDirector = require("../models/BoardOfDirector");

// @desc      CREATE NEW BOARD OF DIRECTOR
// @route     POST /api/v1/boardof-director
// @access    private
exports.createBoardOfDirector = async (req, res) => {
  try {
    const newBoardOfDirector = await BoardOfDirector.create(req.body);
    res.status(200).json({
      success: true,
      message: "board of director created successfully",
      data: newBoardOfDirector,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      GET BOARD OF DIRECTOR
// @route     GET /api/v1/boardof-director/:id
// @access    private
exports.getBoardOfDirector = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await BoardOfDirector.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific boardof-director`,
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
      parseInt(skip) === 0 && BoardOfDirector.countDocuments(),
      parseInt(skip) === 0 && BoardOfDirector.countDocuments(query),
      BoardOfDirector.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all board of director`,
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

// @desc      UPDATE SPECIFIC BOARD OF DIRECTOR
// @route     PUT /api/v1/boardof-director/:id
// @access    private
exports.updateBoardOfDirector = async (req, res) => {
  try {
    const response = await BoardOfDirector.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific board of director",
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

// @desc      DELETE SPECIFIC BOARD OF DIRECTOR
// @route     DELETE /api/v1/boardof-director/:id
// @access    private
exports.deleteBoardOfDirector = async (req, res) => {
  try {
    const boardOfDirector = await BoardOfDirector.findByIdAndDelete(req.query.id);

    if (!boardOfDirector) {
      return res.status(404).json({
        success: false,
        message: "board of director not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "board of director deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
