const { default: mongoose } = require("mongoose");
const Bithulmal = require("../models/bithulmal");
const Membergroup = require("../models/membersGroup");

// @desc      CREATE NEW BITHULMAL
// @route     POST /api/v1/bithulmals
// @access    protect
exports.createBithulmal = async (req, res) => {
  try {
    // Pre-process members data to set status based on amountPaid
    if (req.body.members && Array.isArray(req.body.members)) {
      req.body.members = req.body.members.map((member) => {
        if (member.amountPaid === "0") {
          // Use strict equality here
          member.status = "Unpaid";
        } else if (member.amountPaid > 0 || member.amountPaid !== "") {
          member.status = "Paid";
        } else {
          member.status = "Unpaid";
        }
        return member;
      });
    }

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
      message: err.message, // It's safer to send err.message instead of err directly
    });
  }
};

// @desc      GET ALL BITHULMALS
// @route     GET /api/v1/bithulmals
// @access    public
// exports.getBithulmals = async (req, res) => {
//   try {
//     const { id, skip, limit, searchkey } = req.query;

//     if (id && mongoose.isValidObjectId(id)) {
//       const bithulmal = await Bithulmal.findById(id)
//         .populate("member")
//         .populate("group");
//       return res.status(200).json({
//         success: true,
//         message: "Retrieved specific bithulmal",
//         response: bithulmal,
//       });
//     }
//     let query;
//     query = searchkey
//       ? { ...req.filter, month: { $regex: searchkey, $options: "i" } }
//       : req.filter;

//     if (req.query?.startDate && req.query?.startDate) {
//       query = {
//         month: {
//           $gte: req.query?.startDate,
//           $lte: req.query?.endDate,
//         },
//       };
//     }

//     if (req.query?.month) {
//       const selectedMonth = new Date(req.query.month);
//       const startOfMonth = new Date(
//         selectedMonth.getFullYear(),
//         selectedMonth.getMonth(),
//         1
//       );
//       const endOfMonth = new Date(
//         selectedMonth.getFullYear(),
//         selectedMonth.getMonth() + 1,
//         0
//       );

//       query = {
//         month: {
//           $gte: startOfMonth,
//           $lte: endOfMonth,
//         },
//       };
//     }

//     const [totalCount, filterCount, data] = await Promise.all([
//       parseInt(skip) === 0 && Bithulmal.countDocuments(),
//       parseInt(skip) === 0 && Bithulmal.countDocuments(query),
//       Bithulmal.find(query)
//         .populate("member")
//         .populate("group")
//         .skip(parseInt(skip) || 0)
//         .limit(parseInt(limit) || 50)
//         .sort({ _id: -1 }),
//     ]);

//     const sumAmountPaid = data.reduce((acc, current) => {
//       return acc + parseFloat(current.amountPaid || 0);
//     }, 0);

//     res.status(200).json({
//       success: true,
//       message: `Retrieved all bithulmals`,
//       response: data,
//       count: data.length,
//       totalCount: totalCount || 0,
//       filterCount: filterCount || 0,
//       paidAmount: sumAmountPaid,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       success: false,
//       message: err.toString(),
//     });
//   }
// };

// ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, //

exports.getBithulmals = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, group, monthCount, member } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Bithulmal.findById(id)
        .populate("group")
        .populate("members.member");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific Bithulmal",
        response,
      });
    }

    if (member && mongoose.isValidObjectId(member)) {
      const bithulmal = await Bithulmal.findById(member).populate(
        "members.member"
      );

      // Check if member matches member of any bithulmal object
      if (bithulmal) {
        // Extract simplified members without bithulmal details
        const simplifiedMembers = bithulmal.members.map((member) => ({
          _id: member.member._id,
          name: member.member.name,
          address: member.member.address,
          mobileNumber: member.member.mobileNumber,
          dob: member.member.dob,
          memberStatus: member.member.memberStatus,
        }));

        // Return response with simplified members array
        return res.status(200).json({
          success: true,
          message: "Retrieved all members corresponding to bithulmal",
          response: simplifiedMembers,
          count: simplifiedMembers.length,
          totalCount: simplifiedMembers.length,
          filterCount: simplifiedMembers.length,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Bithulmal not found",
        });
      }
    }

    let query = {};
    if (group && mongoose.isValidObjectId(group)) {
      query.group = group; // Filter by group
    }
    if (searchkey) {
      query.month = { $regex: searchkey, $options: "i" }; // Add search by month
    }

    // Adjust query based on monthCount
    if (monthCount && !isNaN(monthCount)) {
      const count = monthCount - 1;
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - count, 1);
      const end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      query.date = { $gte: start, $lte: end };
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Bithulmal.countDocuments(),
      parseInt(skip) === 0 && Bithulmal.countDocuments(query),
      Bithulmal.find(query)
        .populate("group")
        .populate("members.member")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all Bithulmal`,
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
    // Pre-process members data to set status based on amountPaid, if members data is provided in the request
    if (req.body.members && Array.isArray(req.body.members)) {
      req.body.members = req.body.members.map((member) => {
        if (member.amountPaid === "0") {
          // Use strict equality here
          member.status = "Unpaid";
        } else if (member.amountPaid > 0 || member.amountPaid !== "") {
          member.status = "Paid";
        } else {
          member.status = "Unpaid";
        }
        return member;
      });
    }

    // Assuming req.body.id contains the ID of the document to update.
    // If your client sends the ID differently, adjust accordingly.
    const bithulmalId = req.body.id;
    if (!bithulmalId) {
      return res.status(400).json({
        success: false,
        message: "No Bithulmal ID provided",
      });
    }

    const bithulmal = await Bithulmal.findByIdAndUpdate(bithulmalId, req.body, {
      new: true, // Return the updated document
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
    console.error(err);
    res.status(400).json({
      success: false,
      message: err.message, // It's safer to send err.message instead of err directly
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

exports.getMemberBithulmal = async (req, res) => {
  try {
    const { groupId, memberId } = req.query;

    // Validate group and member IDs
    if (
      !mongoose.isValidObjectId(groupId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid group or member ID",
      });
    }

    // Find bithulmal data for the specified group and member
    const bithulmalData = await Bithulmal.find({
      group: groupId,
      "members.member": memberId,
    });

    // Format the response with required fields
    const formattedResponse = bithulmalData.map((bithulmal) => ({
      month: bithulmal.month,
      date: bithulmal.date,
      status: bithulmal.members.find(
        (member) => member.member.toString() === memberId
      ).status,
      amountPaid: bithulmal.members.find(
        (member) => member.member.toString() === memberId
      ).amountPaid,
    }));

    res.status(200).json({
      success: true,
      message: `Retrieved Bithulmal data for member ${memberId} in group ${groupId}`,
      response: formattedResponse,
      count: formattedResponse.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
      group: req.query.group,
      // month: req.query.month,
    }).populate("member");
    // .populate({
    //   path: "member",
    //   select: "name",
    // });

    const simplifiedResponse = response.map((entry) => {
      return {
        amount: entry.amount,
        amountPaid: entry.amountPaid,
        memberName: entry.memberId.name,
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
    const memberAmounts = await Bithulmal.aggregate([
      { $match: { group: new mongoose.Types.ObjectId(req.query.group) } },
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
  try {
    const { searchkey, month } = req.query;

    const aggregationPipeline = [
      {
        $match: {
          group: req.query.group,
          // month: req.query.month,
        },
      },
    ];

    const bithulmalEntries = await Bithulmal.find({
      group: req.query.group,
      month: req.query.month,
    });
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

exports.getBithulmalByMemberGroupId = async (req, res) => {
  try {
    const group = req.query.group; // Assuming group is passed as a property in the request body

    // Find Bithulmals with the given group
    const bithulmals = await Bithulmal.find({ group: group })
      .populate("member")
      .populate("group");

    if (!bithulmals || bithulmals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Bithulmals found for the provided group",
      });
    }

    res.status(200).json({
      success: true,
      message: `Retrieved Bithulmals for group: ${group}`,
      data: bithulmals,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
