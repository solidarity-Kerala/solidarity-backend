const mongoose = require("mongoose");

const MemberStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum:['ActiveMembers','InactiveMembers']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MemberStatus", MemberStatusSchema);
