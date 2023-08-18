const { default: mongoose } = require("mongoose");
const Bithulmal = require("../models/Bithulmal");
const Membergroup = require("../models/Membersgroup");

// @desc      CREATE NEW BITHULMAL
// @route     POST /api/v1/bithulmals
// @access    protect
exports.createBithulmal = async (req, res) => {
  try {
    const newBithulmal = await Bithulmal.create(req.body);
    res.status(200).json({
      success: true,
      message: "Bithulmal created successfully",
      data: newBithulmal,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL BITHULMALS
// @route     GET /api/v1/bithulmals
// @access    public
exports.getBithulmals = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const bithulmal = await Bithulmal.findById(id)
        .populate("memberId")
        .populate("groupId");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific bithulmal",
        response: bithulmal,
      });
    }

    const query = searchkey
      ? { ...req.filter, month: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Bithulmal.countDocuments(),
      parseInt(skip) === 0 && Bithulmal.countDocuments(query),
      Bithulmal.find(query)
        .populate("memberId")
        .populate("groupId")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all bithulmals`,
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

// @desc      UPDATE SPECIFIC BITHULMAL
// @route     PUT /api/v1/bithulmals/:id
// @access    protect
exports.updateBithulmal = async (req, res) => {
  try {
    const bithulmal = await Bithulmal.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!bithulmal) {
      return res.status(404).json({
        success: false,
        message: "Bithulmal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bithulmal updated successfully",
      data: bithulmal,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC BITHULMAL
// @route     DELETE /api/v1/bithulmals/:id
// @access    protect
exports.deleteBithulmal = async (req, res) => {
  try {
    const bithulmal = await Bithulmal.findByIdAndDelete(req.query.id);

    if (!bithulmal) {
      return res.status(404).json({
        success: false,
        message: "Bithulmal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bithulmal deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET Bithulmal
// @route     GET /api/v1/bithulmal/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Bithulmal.find(
      {},
      { _id: 0, id: "$_id", value: "$month" }
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

exports.getBithulmalReport = async (req, res) => {
  try {
    const { searchkey } = req.query;

    // Define and set the query based on the searchkey parameter if provided
    const query = searchkey
      ? { month: { $regex: searchkey, $options: "i" } }
      : {};

    // Calculate total amount for each month
    const monthlyAmounts = await Bithulmal.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$month",
          amount: { $sum: "$amountPaid" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved Bithulmal report`,
      response: monthlyAmounts,
      count: monthlyAmounts.length,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.getBithulmalReportByMemberGroup = async (req, res) => {
  try {
    const { searchkey, month } = req.query;

    const response = await Bithulmal.find({
      groupId: req.query.groupId,
      month: req.query.month,
    }).populate({
      path: 'memberId',
      select: 'name'
    });

    const simplifiedResponse = response.map(entry => {
      return {
        amount: entry.amount,
        amountPaid: entry.amountPaid,
        memberName: entry.memberId.name
      };
    });

    res.status(200).json({
      success: true,
      message: `Retrieved Bithulmal report`,
      simplifiedResponse,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.getAmountPaidByMemberInMemberGroup = async (req, res) => {
  try {
    // const { groupId } = req.query;
    // console.log("Finding member group...", req.query);

    // const group = await Membergroup.findById(groupId);
    // console.log("Finding member group...", group);
    // if (!groupId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing groupId parameter.",
    //   });
    // }

    // if (!group) {
    //   console.log("Member group not found.");
    //   return res.status(404).json({
    //     success: false,
    //     message: "Member group not found.",
    //   });
    // }

    // console.log("Calculating member amounts...");
    // const memberAmounts = await Bithulmal.aggregate([
    //   { $match: { groupId: groupId } },
    //   {
    //     $group: {
    //       _id: "$memberId",
    //       memberId: { $first: "$memberId" },
    //       amountPaid: { $sum: "$amountPaid" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "members", // Replace with the actual name of the member collection
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "memberInfo",
    //     },
    //   },
    //   {
    //     $unwind: "$memberInfo",
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       memberId: "$_id",
    //       memberName: "$memberInfo.name",
    //       amountPaid: 1,
    //     },
    //   },
    // ]);

    // const response = await Bithulmal.find({ groupId: req.query.groupId });

    const memberAmounts = await Bithulmal.aggregate([
      { $match: { groupId: new mongoose.Types.ObjectId(req.query.groupId) } },
      {
        $group: {
          _id: "$memberId",
          memberId: { $first: "$memberId" },
          totalAmountPaid: { $sum: { $toInt: "$amountPaid" } }, // Convert to integer and sum
        },
      },
      {
        $lookup: {
          from: "members", // Replace with the actual name of the member collection
          localField: "_id",
          foreignField: "_id",
          as: "memberInfo",
        },
      },
      {
        $unwind: "$memberInfo",
      },
      {
        $project: {
          _id: 0,
          memberId: "$_id",
          memberName: "$memberInfo.name",
          totalAmountPaid: 1,
        },
      },
    ]);

    console.log("Sending response...");
    res.status(200).json({
      success: true,
      message: `Retrieved amount paid by each member in the group.`,
      // response: memberAmounts,
      // count: memberAmounts.length,
      memberAmounts,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.sumBithumalAmount = async (req, res) => {
  console.log(req.query)
  try {
    const { searchkey, month } = req.query;

    const aggregationPipeline = [
      {
        $match: {
          groupId: req.query.groupId,
          // month: req.query.month,
        }
      },
    ];

    const bithulmalEntries = await Bithulmal.find({ groupId: req.query.groupId, month: req.query.month })
    let totalAmountPaid = 0;

    for (const entry of bithulmalEntries) {
      totalAmountPaid += parseFloat(entry.amountPaid);
    }

    res.status(200).json({
      success: true,
      message: `Total Bithulmal amount for the specified criteria`,
      totalAmountPaid: totalAmountPaid.toFixed(2),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};