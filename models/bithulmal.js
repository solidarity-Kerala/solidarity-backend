const mongoose = require("mongoose");

const bithulmalSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    date: {
      type: Date,
    },
    // member: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Member",
    // },
    members: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
        },
        status: {
          type: String,
          enum: ["Paid", "Unpaid"],
          default: "Unpaid",
        },
        amountPaid: {
          type: String,
        },
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membersgroup",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for status counts
bithulmalSchema.virtual("statusCounts").get(function () {
  const statusCounts = { Paid: 0, Unpaid: 0 };
  this.members.forEach((member) => {
    if (statusCounts[member.status] !== undefined) {
      statusCounts[member.status]++;
    }
  });
  return statusCounts;
});
module.exports = mongoose.model("Bithulmal", bithulmalSchema);
