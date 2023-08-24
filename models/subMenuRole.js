const mongoose = require("mongoose");

const SubMenuRoleSchema = new mongoose.Schema(
  {
    subMenu: {
      type: mongoose.Schema.ObjectId,
      ref: "SubMenu",
      required: true,
      default: null,
    },
    userType: {
      type: mongoose.Schema.ObjectId,
      ref: "UserType",
      required: true,
      default: null,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    add: {
      type: Boolean,
      required: true,
      default: true,
    },
    update: {
      type: Boolean,
      required: true,
      default: true,
    },
    delete: {
      type: Boolean,
      required: true,
      default: true,
    },
    export: {
      type: Boolean,
      required: true,
      default: true,
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubMenuRole", SubMenuRoleSchema);
