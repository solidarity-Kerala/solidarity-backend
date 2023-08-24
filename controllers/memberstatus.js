const { default: mongoose } = require("mongoose");
const MembersStatus = require("../models/memberstatus");

// @desc      CREATE NEW MEMBER STATUS
// @route     POST /api/v1/members-status
// @access    protect
exports.createMemberStatus = async (req, res) => {
  try {
    const newMemberStatus = await MembersStatus.create(req.body);
    res.status(200).json({
      success: true,
      message: "Member Status created successfully",
      data: newMemberStatus,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL MEMBERS STATUS
// @route     GET /api/v1/members-status
// @access    public
exports.getMembersStatus = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const memberStatus = await MembersStatus.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific member",
        response: memberStatus,
      });
    }

    const query = searchkey
      ? { ...req.filter, status: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && MembersStatus.countDocuments(),
      parseInt(skip) === 0 && MembersStatus.countDocuments(query),
      MembersStatus.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all members Status`,
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

// @desc      UPDATE SPECIFIC MEMBER STATUS
// @route     PUT /api/v1/members-status/:id
// @access    protect
exports.updateMemberStatus = async (req, res) => {
  try {
    const memberStatus = await MembersStatus.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

    if (!memberStatus) {
      return res.status(404).json({
        success: false,
        message: "Member  Status not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member Status updated successfully",
      data: memberStatus,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC MEMBER STATUS
// @route     DELETE /api/v1/members-status/:id
// @access    protect
exports.deleteMemberStatus = async (req, res) => {
  try {
    const member = await MembersStatus.findByIdAndDelete(req.query.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member Status not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member Status deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET Members Status
// @route     GET /api/v1/members-status/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await MembersStatus.find(
      {},
      { _id: 0, id: "$_id", value: "$status" }
    );
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
