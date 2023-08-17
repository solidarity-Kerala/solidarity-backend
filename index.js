const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://zealous-hill-058fc7310.3.azurestaticapps.net",
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
const appointment = require("./routes/appointment.js");
const faq = require("./routes/faq");
const boardOfDirector = require("./routes/boardOfDirector");
const faculties = require("./routes/faculties");
const administrativeCouncil = require("./routes/administrativeCouncil");
const news = require("./routes/news");
const course = require("./routes/course");
const department = require("./routes/department");
const aboutus = require("./routes/aboutUs");
const gallery = require("./routes/gallery");
const blog = require("./routes/blog");
const district = require("./routes/district.js");
const area = require("./routes/area.js");
const membersgroup = require("./routes/membersgroup.js");
const member = require("./routes/members.js");
const admin = require("./routes/admin.js");
const memberstatus = require("./routes/memberstatus.js");
const designation = require("./routes/designation.js");
const attendance = require("./routes/attendance.js");
const bithulmal = require("./routes/bithulmal.js");
const associates = require("./routes/associates.js");
const product = require("./routes/product.js");
const productDetails = require("./routes/productDetails.js");
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
app.use("/api/v1/appointment", appointment);
app.use("/api/v1/faq", faq);
app.use("/api/v1/boardof-director", boardOfDirector);
app.use("/api/v1/faculties", faculties);
app.use("/api/v1/administrative-council", administrativeCouncil);
app.use("/api/v1/news", news);
app.use("/api/v1/course", course);
app.use("/api/v1/department", department);
app.use("/api/v1/about-us", aboutus);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/blog", blog);
app.use("/api/v1/district", district);
app.use("/api/v1/area", area);
app.use("/api/v1/members-group", membersgroup);
app.use("/api/v1/member", member);
app.use("/api/v1/admin", admin);
app.use("/api/v1/member-status", memberstatus);
app.use("/api/v1/designation", designation);
app.use("/api/v1/attendence", attendance);
app.use("/api/v1/bithulmal", bithulmal);
app.use("/api/v1/associates", associates);
app.use("/api/v1/product", product);
app.use("/api/v1/product-details", productDetails);
const PORT = process.env.PORT || 8030;
app.listen(PORT, console.log(`port is running ${PORT}`));
