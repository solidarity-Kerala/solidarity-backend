const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  let role;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    role = req.headers.authorization.split(" ")[2];
    // Set token from cookie
  }
  if (!token) {
    // return next(new ErrorResponse("Not authorized to access this route", 401));
    return res.status(401).json({
      success: false,
      message: "No token available to authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).populate("userType");
    // console.log(token, req.user);
    next();
  } catch (err) {
    // return next(new ErrorResponse("Not authorized to access this route two ", 401));
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req?.user?.userType?.role)) {
      // return next(
      //   new ErrorResponse(
      //     `User role ${req.user?.userType?.role} is not authorized to access this route`,
      //     403
      //   )
      // );
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.userType?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
