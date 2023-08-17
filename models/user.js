const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    cprNumber: {
      type: String,
      // unique: true,
      // required: true,
    },
    userDisplayName: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      // unique: true,
      // required: true,
    },
    email: {
      type: String,
      // unique: true,
      // required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      select: false,
    },
    authType: {
      type: String,
      // enum: ["usernamePassword", "google", "apple"],
      default: "usernamePassword",
    },
    authKey: {
      type: String,
    },
    userType: {
      type: mongoose.Schema.ObjectId,
      ref: "UserType",
      default: null,
    },
    userImage: {
      type: String,
    },
    franchise: {
      type: mongoose.Schema.ObjectId,
      ref: "Franchise",
      default: null,
    },
    identityType: {
      type: String,
    },
    identityImage: {
      type: String,
    },
    identityNumber: {
      type: String,
    },
    school: {
      type: String,
    },
    rollNumber: {
      type: String,
    },
    division: {
      type: String,
    },
    grade: {
      type: String,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    deletedDate: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
