const Admin = require("../models/adminModel");
const Members = require("../models/members");
const Membersgroup = require("../models/membersGroup");
const Menu = require("../models/menu");
const User = require("../models/user");

const getMenu = async (role) => {
  const menu = await Menu.aggregate([
    {
      $lookup: {
        from: "menuroles",
        localField: "_id",
        foreignField: "menu",
        as: "menuRoles",
      },
    },
    {
      $match: {
        "menuRoles.userType": role?._id, // Replace req.user.userType._id with the desired user role
      },
    },
    {
      $lookup: {
        from: "submenus",
        localField: "_id",
        foreignField: "menu",
        as: "submenus",
        pipeline: [
          {
            $lookup: {
              from: "submenuroles",
              localField: "_id",
              foreignField: "subMenu",
              as: "subMenuRoles",
            },
          },
          {
            $match: {
              "subMenuRoles.userType": role?._id,
            },
          },
          {
            $sort: { sequence: 1 }, // Sort the submenus by sequence
          },
        ],
      },
    },
    {
      $sort: { sequence: 1 }, // Sort the submenus by sequence
    },
  ]).exec();

  return menu;
};

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, res) => {
  const { email, password, userType, _id } = user;
  const token = user.getSignedJwtToken();
  if (!token) {
    res.status(200).json({
      success: false,
      message: "Something went wrong!",
    });
  } else {
    console.log(userType);
    const menu = await getMenu(userType);
    const member = await Members.findOne({ user: user._id });
    const memberGroup = await Membersgroup.findOne({ member: member?._id });
    res.status(200).json({
      user,
      menu,
      member,
      token,
      success: true,
      memberGroup: memberGroup,
      message: "welcome back",
    });
  }
};

// @desc      GET CURRENT LOGGED UER
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res) => {
  //This req.user come from middleware -> auth -> protect
  const admin = await User.findById(req.user.id);

  // if (admin.role === "admin") {
  res.status(200).json({
    success: true,
    admin,
  });
  // }
};

// @desc      LOGIN USER
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const checkMail = await User.findOne({ email })
      .populate("userType")
      .select("+password");

    if (!checkMail) {
      res.status(200).json({
        success: false,
        message: "There is no user corresponding to the email address.",
      });
    } else {
      const checkPassword = await checkMail.matchPassword(password);
      if (!checkPassword) {
        res.status(200).json({
          success: false,
          message: "Wrong password",
        });
      } else {
        sendTokenResponse(checkMail, res);
      }
    }
  } catch (err) {
    console.log("error check", err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      LOGIN ADMIN
// @route     POST /api/v1/auth/admin-login
// @access    Public
exports.adminLogin = async (req, res) => {
  console.log(req.body);
  const { username } = req.body;
  try {
    const admin = await Admin.findOne({ username })
      .populate("group") // Populate the membersGroupId field
      .exec();
    console.log(admin);

    if (!admin) {
      res.status(200).json({
        success: false,
        message: "Admin with that username not found.",
      });
    } else {
      if (admin.password !== req.body.password) {
        res.status(200).json({
          success: false,
          message: "Wrong password",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Admin logged in successfully.",
          adminId: admin._id,
          membersGroupId: admin.membersGroupId
            ? admin.membersGroupId._id
            : null,
          admin,
        });
      }
    }
  } catch (err) {
    console.log("error check", err);
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Check if email already exists
    const existingUser = await User.exists({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user
    const user = await User.create({ email, username, password });

    sendTokenResponse(user, res);
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};
