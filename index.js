const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://gentle-forest-0ff497700.3.azurestaticapps.net",
  "https://solidarity-cms-szb9l.ondigitalocean.app",
];

//cors policy
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Connect to database
connectDB();

app.use("/images", express.static("./public/user"));
app.use("/images", express.static("./public/proteincategory"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route files
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const franchise = require("./routes/franchise.js");
const userType = require("./routes/userType.js");
const menu = require("./routes/menu.js");
const subMenu = require("./routes/subMenu.js");
const menuRole = require("./routes/menuRole.js");
const subMenuRole = require("./routes/subMenuRole.js");
const dashboard = require("./routes/dashboard.js");
const gallery = require("./routes/gallery");
const district = require("./routes/district.js");
const area = require("./routes/area.js");
const membersgroup = require("./routes/membersGroup.js");
const member = require("./routes/members.js");
const admin = require("./routes/admin.js");
const memberstatus = require("./routes/memberStatus.js");
const attendance = require("./routes/attendance.js");
const bithulmal = require("./routes/bithulmal.js");
const notifications = require("./routes/notification.js");
const designation = require("./routes/designation.js");
const unit = require('./routes/unit.js');
// mount routers
app.use("/api/V1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/user-type", userType);
app.use("/api/v1/menu", menu);
app.use("/api/v1/sub-menu", subMenu);
app.use("/api/v1/menu-role", menuRole);
app.use("/api/v1/submenu-role", subMenuRole);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/franchise", franchise);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/district", district);
app.use("/api/v1/area", area);
app.use("/api/v1/members-group", membersgroup);
app.use("/api/v1/member", member);
app.use("/api/v1/admin", admin);
app.use("/api/v1/member-status", memberstatus);
app.use("/api/v1/attendence", attendance);
app.use("/api/v1/bithulmal", bithulmal);
app.use("/api/v1/notification", notifications);
app.use("/api/v1/designation", designation);
app.use("/api/v1/unit", unit);
// app.use("/api/v1/present-absent-members-count",presentAbsentMembersByMonthwithcount):

const PORT = process.env.PORT || 8085;
app.listen(PORT, console.log(`port is running ${PORT}`));
