const mongoose = require("mongoose");

const connectDB = async () => {
  const URL = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    });
    // Create a unique index on "cprNumber" field of the "users" collection
    mongoose.connection.once("open", () => {
      mongoose.connection
        .collection("users")
        .createIndex({ cprNumber: 1 }, { unique: true });
    });
    console.log(
      "\x1b[36m%s\x1b[0m",
      `MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.log("mongoose connection error", error);
    throw error;
  }
};

module.exports = connectDB;
