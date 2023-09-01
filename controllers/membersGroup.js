const { default: mongoose } = require("mongoose");
const Membersgroup = require("../models/membersGroup");
const Bithulmal = require("../models/bithulmal");

// @desc      CREATE NEW MEMBERS GROUP
// @route     POST /api/v1/membersgroup
// @access    protect
exports.createMembersGroup = async (req, res) => {
  try {
    const newMembersGroup = await Membersgroup.create(req.body);
    res.status(200).json({
      success: true,
      message: "Members group created successfully",
      data: newMembersGroup,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL MEMBERS GROUPS
// @route     GET /api/v1/membersgroup
// @access    public
exports.getMembersGroups = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const membersGroup = await Membersgroup.findById(id).populate("area");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific members group",
        response: membersGroup,
      });
    }

    const query = searchkey
      ? { ...req.filter, groupName: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Membersgroup.countDocuments(),
      parseInt(skip) === 0 && Membersgroup.countDocuments(query),
      Membersgroup.find(query)
        .populate("area")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    const groupDataPromises = data.map(async (group) => {
      const bithulmals = await Bithulmal.find({ group: group._id });
      const sumAmountPaid = bithulmals.reduce((acc, current) => {
        return acc + parseFloat(current.amountPaid || 0);
      }, 0);

      return {
        group: group,
        area: group?.area,
        totalAmountPaid: sumAmountPaid,
      };
    });

    const groupData = await Promise.all(groupDataPromises);

    res.status(200).json({
      success: true,
      message: `Retrieved all members groups with total amounts`,
      response: groupData,
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

// @desc      UPDATE SPECIFIC MEMBERS GROUP
// @route     PUT /api/v1/membersgroup/:id
// @access    protect
exports.updateMembersGroup = async (req, res) => {
  try {
    const membersGroup = await Membersgroup.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

    if (!membersGroup) {
      return res.status(404).json({
        success: false,
        message: "Members group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Members group updated successfully",
      data: membersGroup,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC MEMBERS GROUP
// @route     DELETE /api/v1/membersgroup/:id
// @access    protect
exports.deleteMembersGroup = async (req, res) => {
  try {
    const membersGroup = await Membersgroup.findByIdAndDelete(req.query.id);

    if (!membersGroup) {
      return res.status(404).json({
        success: false,
        message: "Members group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Members group deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET Members group
// @route     GET /api/v1/members-group/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Membersgroup.find(
      {},
      { _id: 0, id: "$_id", value: "$groupName" }
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
